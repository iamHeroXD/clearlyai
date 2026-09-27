import fs from 'fs';
import path from 'path';

// Create directories
const publicIconsDir = path.resolve('public/icons');
const srcIconsDir = path.resolve('src/icons');

fs.mkdirSync(publicIconsDir, { recursive: true });
fs.mkdirSync(srcIconsDir, { recursive: true });

// Minimal valid PNG buffer generator for 16, 32, 48, 128
// We can generate clean RGBA PNGs using a pure JS PNG encoder
function createPNG(width, height, r, g, b, a) {
  // Minimal PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const combined = Buffer.concat([typeBuf, data]);
    
    // CRC32
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < combined.length; i++) {
      crc = crcTable[(crc ^ combined[i]) & 0xFF] ^ (crc >>> 8);
    }
    crc = (crc ^ 0xFFFFFFFF) >>> 0;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  // Precompute CRC table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  // Raw uncompressed IDAT with deflate zlib header
  // Line filter = 0
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Draw a smooth rounded icon with blue gradient and white sparkle center
      const cx = width / 2;
      const cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const radius = width * 0.45;

      if (dist <= radius) {
        // Sparkle in center
        const isCenter = Math.abs(x - cx) < width * 0.15 || Math.abs(y - cy) < height * 0.15;
        if (isCenter && dist < width * 0.25) {
          rawData[pixelOffset] = 255;
          rawData[pixelOffset + 1] = 255;
          rawData[pixelOffset + 2] = 255;
          rawData[pixelOffset + 3] = 255;
        } else {
          rawData[pixelOffset] = r;
          rawData[pixelOffset + 1] = g;
          rawData[pixelOffset + 2] = b;
          rawData[pixelOffset + 3] = a;
        }
      } else {
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      }
    }
  }

  // Deflate using zlib
  import('zlib').then(({ deflateSync }) => {
    const compressed = deflateSync(rawData);
    const idatChunk = createChunk('IDAT', compressed);
    const ihdrChunk = createChunk('IHDR', ihdr);
    const iendChunk = createChunk('IEND', Buffer.alloc(0));
    const fullPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

    fs.writeFileSync(path.join(publicIconsDir, `icon${width}.png`), fullPng);
    fs.writeFileSync(path.join(srcIconsDir, `icon${width}.png`), fullPng);
  });
}

[16, 32, 48, 128].forEach(size => {
  createPNG(size, size, 37, 99, 235, 255); // Blue #2563eb
});

console.log('Icons generated successfully.');
