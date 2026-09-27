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

// Create 1-click batch launcher
const batLauncher = `@echo off
title Clearly Desktop OS
echo Starting Clearly Ambient Desktop Engine...
powershell -ExecutionPolicy Bypass -File "%~dp0run_server.ps1"
`;
fs.writeFileSync(path.resolve(distDesktopDir, 'Launch_Clearly_Desktop.bat'), batLauncher);

const desktopReadme = `Clearly Desktop — Ambient Screen Intelligence & Text Deconstruction
Version 1.0.0 (Windows x64 / Cross-Platform)

Quick Start:
1. Double-click "Launch_Clearly_Desktop.bat".
2. A native standalone desktop window will launch instantly at http://localhost:8174.
3. Use the Global Screen Controller to highlight or snip any text across your desktop apps (PDFs, VS Code, Slack, Terminal).
4. Switch between 6 instant lenses: Polish, Meaning, Simplify, Deconstruct, Counter-argument, and Translation.
5. Press Alt+Space or Ctrl+Shift+C anytime to launch the floating Spotlight HUD.

Online Edition:
You can also use the live Web App version directly without downloading at:
https://clearly-ai-lake.vercel.app/app
`;
fs.writeFileSync(path.resolve(distDesktopDir, 'README.txt'), desktopReadme);

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
  console.log('✓ Successfully created clearly-extension-v1.0.0.zip!');

  console.log(`🗜️ Packaging ${desktopZipPath}...`);
  execSync(`powershell -Command "Compress-Archive -Path '${distDesktopDir.replace(/'/g, "''")}\\*' -DestinationPath '${desktopZipPath.replace(/'/g, "''")}' -Force"`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✓ Successfully created clearly-desktop-v1.0.0-windows.zip!');
} catch (e) {
  console.error('Packaging error:', e);
}
