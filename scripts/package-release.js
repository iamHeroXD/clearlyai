import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📦 Packaging Clearly Extension & Desktop releases (Deterministic & Cross-Platform)...');

const distDir = path.resolve(rootDir, 'dist');
const distDesktopDir = path.resolve(rootDir, 'dist-desktop');
const websitePublicDownloads = path.resolve(rootDir, 'website/public/downloads');

if (!fs.existsSync(websitePublicDownloads)) {
  fs.mkdirSync(websitePublicDownloads, { recursive: true });
}

// 1. Build Extension if needed
if (!fs.existsSync(path.resolve(distDir, 'manifest.json'))) {
  console.log('⚙️ Building Chrome Extension...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
}

// 2. Build Desktop if needed
if (!fs.existsSync(path.resolve(distDesktopDir, 'index.html'))) {
  console.log('⚙️ Building Desktop Studio...');
  execSync('npm run build:desktop', { cwd: rootDir, stdio: 'inherit' });
}

// Create PowerShell script server for zero-dependency native desktop launch
const ps1Launcher = `$port = 8174
$path = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    $port = 8175
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

$edgePath = "$env:ProgramFiles (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "$env:ProgramFiles\\Microsoft\\Edge\\Application\\msedge.exe"
}
$chromePath = "$env:ProgramFiles\\Google\\Chrome\\Application\\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "$env:ProgramFiles (x86)\\Google\\Chrome\\Application\\chrome.exe"
}

if (Test-Path $edgePath) {
    Start-Process $edgePath -ArgumentList "--app=http://localhost:$port", "--window-size=1240,840"
} elseif (Test-Path $chromePath) {
    Start-Process $chromePath -ArgumentList "--app=http://localhost:$port", "--window-size=1240,840"
} else {
    Start-Process "http://localhost:$port"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/" -or [string]::IsNullOrEmpty($localPath)) {
        $localPath = "/index.html"
    }
    $filePath = Join-Path $path ($localPath.TrimStart("/").Replace("/", "\\"))
    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css; charset=utf-8" }
            ".json" { $response.ContentType = "application/json" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            ".png"  { $response.ContentType = "image/png" }
            ".ico"  { $response.ContentType = "image/x-icon" }
            default { $response.ContentType = "application/octet-stream" }
        }
        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.OutputStream.Close()
}
`;
fs.writeFileSync(path.resolve(distDesktopDir, 'run_server.ps1'), ps1Launcher);

// Create 1-click batch launcher
const batLauncher = `@echo off
title Clearly Reader Studio
echo Starting Clearly Reader Studio local workspace...
powershell -ExecutionPolicy Bypass -File "%~dp0run_server.ps1"
`;
fs.writeFileSync(path.resolve(distDesktopDir, 'Launch_Clearly_Reader.bat'), batLauncher);

const desktopReadme = `Clearly Reader Studio — Local Document & Deep Reading Workbench
Version 1.0.0 (Windows / Portable)

Quick Start:
1. Double-click "Launch_Clearly_Reader.bat".
2. Clearly Reader Studio will launch in a dedicated application window at http://localhost:8174.
3. Open any local text or Markdown file, or paste excerpts to deconstruct them across Clearly's canonical lenses.
4. Save key takeaways to your Library and organize study notes locally.
`;
fs.writeFileSync(path.resolve(distDesktopDir, 'README.txt'), desktopReadme);

/**
 * Pure Node.js cross-platform deterministic ZIP packager.
 * Zero external CLI dependencies (works identically on Linux, macOS, and Windows).
 * Fixed DOS timestamp guarantees byte-for-byte reproducibility.
 */
function createDeterministicZip(sourceDir, destZipPath) {
  const files = [];

  function walk(dir, relPath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(fullPath, entryRelPath);
      } else if (entry.isFile()) {
        files.push({ fullPath, relPath: entryRelPath.replace(/\\/g, '/') });
      }
    }
  }

  walk(sourceDir);
  files.sort((a, b) => a.relPath.localeCompare(b.relPath));

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  // Fixed DOS timestamp: 2026-01-01 00:00:00 (deterministic archive)
  const dosTime = 0;
  const dosDate = 0x5C21;

  for (const file of files) {
    const content = fs.readFileSync(file.fullPath);
    const uncompressedSize = content.length;
    const crc = zlib.crc32(content);
    const compressedData = zlib.deflateRawSync(content);
    const compressedSize = compressedData.length;
    const nameBuf = Buffer.from(file.relPath, 'utf8');

    // Local file header (30 bytes + name length)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature
    localHeader.writeUInt16LE(20, 4);         // Version needed (2.0)
    localHeader.writeUInt16LE(0x0800, 6);     // General purpose flag (UTF-8)
    localHeader.writeUInt16LE(8, 8);          // Compression (Deflate)
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, compressedData);

    // Central directory header (46 bytes + name length)
    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Signature
    centralHeader.writeUInt16LE(20, 4);          // Version made by (2.0)
    centralHeader.writeUInt16LE(20, 6);          // Version needed (2.0)
    centralHeader.writeUInt16LE(0x0800, 8);      // UTF-8
    centralHeader.writeUInt16LE(8, 10);          // Deflate
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);          // Extra field length
    centralHeader.writeUInt16LE(0, 32);          // Comment length
    centralHeader.writeUInt16LE(0, 34);          // Disk start
    centralHeader.writeUInt16LE(0, 36);          // Internal attributes
    centralHeader.writeUInt32LE(0x81a40000, 38); // External attributes
    centralHeader.writeUInt32LE(offset, 42);     // Relative offset
    nameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);
    offset += localHeader.length + compressedData.length;
  }

  const centralDirStart = offset;
  const centralDirBuf = Buffer.concat(centralHeaders);
  const centralDirSize = centralDirBuf.length;

  // End of Central Directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);        // Signature
  eocd.writeUInt16LE(0, 4);                 // Disk number
  eocd.writeUInt16LE(0, 6);                 // Disk with central dir
  eocd.writeUInt16LE(files.length, 8);      // Entries on disk
  eocd.writeUInt16LE(files.length, 10);     // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);   // Size of central dir
  eocd.writeUInt32LE(centralDirStart, 16);  // Offset of central dir
  eocd.writeUInt16LE(0, 20);                // Comment length

  const finalZipBuffer = Buffer.concat([...localHeaders, centralDirBuf, eocd]);
  fs.writeFileSync(destZipPath, finalZipBuffer);
}

function computeSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Package Extension ZIP
const extensionZipPath = path.resolve(websitePublicDownloads, 'clearly-extension-v1.0.0.zip');
if (fs.existsSync(extensionZipPath)) {
  fs.unlinkSync(extensionZipPath);
}

// Package Desktop ZIP
const desktopZipPath = path.resolve(websitePublicDownloads, 'clearly-desktop-v1.0.0-windows.zip');
if (fs.existsSync(desktopZipPath)) {
  fs.unlinkSync(desktopZipPath);
}

try {
  console.log(`🗜️ Packaging ${extensionZipPath} (deterministic)...`);
  createDeterministicZip(distDir, extensionZipPath);
  const extSha = computeSha256(extensionZipPath);
  const extStat = fs.statSync(extensionZipPath);
  console.log(`✓ Successfully created clearly-extension-v1.0.0.zip! (${extStat.size} bytes, SHA-256: ${extSha})`);

  console.log(`🗜️ Packaging ${desktopZipPath} (deterministic)...`);
  createDeterministicZip(distDesktopDir, desktopZipPath);
  const deskSha = computeSha256(desktopZipPath);
  const deskStat = fs.statSync(desktopZipPath);
  console.log(`✓ Successfully created clearly-desktop-v1.0.0-windows.zip! (${deskStat.size} bytes, SHA-256: ${deskSha})`);

  // Deterministic release manifest: NO generated timestamps inside reproducible artifact
  const manifest = {
    version: '1.0.0',
    artifacts: [
      {
        filename: 'clearly-extension-v1.0.0.zip',
        sizeBytes: extStat.size,
        sha256: extSha,
      },
      {
        filename: 'clearly-desktop-v1.0.0-windows.zip',
        sizeBytes: deskStat.size,
        sha256: deskSha,
      },
    ],
  };

  fs.writeFileSync(
    path.resolve(websitePublicDownloads, 'release-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8'
  );
  console.log('✓ Successfully wrote deterministic release-manifest.json with verified checksums!');
} catch (e) {
  console.error('Packaging error:', e);
  process.exit(1);
}
