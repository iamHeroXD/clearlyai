import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📦 Packaging Clearly Extension & Desktop releases...');

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
  console.log('⚙️ Building Desktop App...');
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
    # If already running or port busy, try next port
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

import crypto from 'crypto';

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
  console.log(`🗜️ Packaging ${extensionZipPath}...`);
  execSync(`powershell -Command "Compress-Archive -Path '${distDir.replace(/'/g, "''")}\\*' -DestinationPath '${extensionZipPath.replace(/'/g, "''")}' -Force"`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  const extSha = computeSha256(extensionZipPath);
  const extStat = fs.statSync(extensionZipPath);
  console.log(`✓ Successfully created clearly-extension-v1.0.0.zip! (SHA-256: ${extSha.slice(0, 12)}...)`);

  console.log(`🗜️ Packaging ${desktopZipPath}...`);
  execSync(`powershell -Command "Compress-Archive -Path '${distDesktopDir.replace(/'/g, "''")}\\*' -DestinationPath '${desktopZipPath.replace(/'/g, "''")}' -Force"`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  const deskSha = computeSha256(desktopZipPath);
  const deskStat = fs.statSync(desktopZipPath);
  console.log(`✓ Successfully created clearly-desktop-v1.0.0-windows.zip! (SHA-256: ${deskSha.slice(0, 12)}...)`);

  const manifest = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
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
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
  console.log('✓ Successfully wrote release-manifest.json with verified checksums!');
} catch (e) {
  console.error('Packaging error:', e);
  process.exit(1);
}

