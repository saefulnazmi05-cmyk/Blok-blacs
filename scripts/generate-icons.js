/**
 * Generates PNG PWA icon assets using Node.js built-in zlib
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

function writePng(width, height, getPixelRGBA) {
  const rowBytes = 1 + width * 4;
  const uncompressed = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    uncompressed[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixelRGBA(x, y, width, height);
      uncompressed[pxOffset] = r;
      uncompressed[pxOffset + 1] = g;
      uncompressed[pxOffset + 2] = b;
      uncompressed[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(uncompressed, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = Buffer.alloc(4);
  ihdrCrc.writeUInt32BE(crc32(Buffer.concat([ihdrType, ihdrData])), 0);

  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    ihdrType,
    ihdrData,
    ihdrCrc
  ]);

  // IDAT
  const idatType = Buffer.from('IDAT');
  const idatLen = Buffer.alloc(4);
  idatLen.writeUInt32BE(compressed.length, 0);
  const idatCrc = Buffer.alloc(4);
  idatCrc.writeUInt32BE(crc32(Buffer.concat([idatType, compressed])), 0);

  const idatChunk = Buffer.concat([idatLen, idatType, compressed, idatCrc]);

  // IEND
  const iendType = Buffer.from('IEND');
  const iendCrc = Buffer.alloc(4);
  iendCrc.writeUInt32BE(crc32(iendType), 0);
  const iendChunk = Buffer.concat([Buffer.from([0, 0, 0, 0]), iendType, iendCrc]);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Pixel Renderer for Block Blast
function renderBlockBlastIcon(x, y, w, h, isMaskable = false) {
  // Normalize to 0..1
  const nx = x / w;
  const ny = y / h;

  // Background: Deep Navy/Slate gradient (#0F172A to #020617)
  let bgR = 15 - Math.floor(ny * 10);
  let bgG = 23 - Math.floor(ny * 15);
  let bgB = 42 - Math.floor(ny * 20);

  // If not maskable, round corners with a squircle radius
  if (!isMaskable) {
    const r = 0.22; // corner radius in normalized coords
    let distFromCorner = 0;
    const cx = nx < 0.5 ? r : 1 - r;
    const cy = ny < 0.5 ? r : 1 - r;
    if ((nx < r || nx > 1 - r) && (ny < r || ny > 1 - r)) {
      const dx = nx - cx;
      const dy = ny - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) {
        return [0, 0, 0, 0]; // Transparent outside squircle
      }
    }
  }

  // Inner playable area (scale slightly smaller for maskable to stay inside safe 80% circle)
  const scale = isMaskable ? 0.68 : 0.82;
  const center = 0.5;
  const localX = (nx - center) / scale + 0.5;
  const localY = (ny - center) / scale + 0.5;

  if (localX >= 0.12 && localX <= 0.88 && localY >= 0.12 && localY <= 0.88) {
    // 2x2 grid of blocks:
    // Top-Left: Cyan (0.16..0.47, 0.16..0.47)
    // Top-Right: Amber (0.53..0.84, 0.16..0.47)
    // Bottom-Left: Emerald (0.16..0.47, 0.53..0.84)
    // Bottom-Right: Rose (0.53..0.84, 0.53..0.84)

    const blocks = [
      { minX: 0.16, maxX: 0.47, minY: 0.16, maxY: 0.47, colTop: [56, 189, 248], colBot: [2, 132, 199] },
      { minX: 0.53, maxX: 0.84, minY: 0.16, maxY: 0.47, colTop: [251, 191, 36], colBot: [217, 119, 6] },
      { minX: 0.16, maxX: 0.47, minY: 0.53, maxY: 0.84, colTop: [52, 211, 153], colBot: [5, 150, 105] },
      { minX: 0.53, maxX: 0.84, minY: 0.53, maxY: 0.84, colTop: [244, 63, 94], colBot: [190, 18, 60] }
    ];

    for (const b of blocks) {
      if (localX >= b.minX && localX <= b.maxX && localY >= b.minY && localY <= b.maxY) {
        const u = (localX - b.minX) / (b.maxX - b.minX);
        const v = (localY - b.minY) / (b.maxY - b.minY);

        // Check rounded corners of the block
        const bRad = 0.22;
        const bcx = u < 0.5 ? bRad : 1 - bRad;
        const bcy = v < 0.5 ? bRad : 1 - bRad;
        if ((u < bRad || u > 1 - bRad) && (v < bRad || v > 1 - bRad)) {
          const du = u - bcx;
          const dv = v - bcy;
          if (Math.sqrt(du * du + dv * dv) > bRad) {
            continue; // Fall through to background
          }
        }

        // Gradient interpolation
        let r = Math.round(b.colTop[0] * (1 - v) + b.colBot[0] * v);
        let g = Math.round(b.colTop[1] * (1 - v) + b.colBot[1] * v);
        let bl = Math.round(b.colTop[2] * (1 - v) + b.colBot[2] * v);

        // Glass top highlight
        if (v < 0.45) {
          const highlight = (1 - v / 0.45) * 0.45;
          r = Math.min(255, Math.round(r + (255 - r) * highlight));
          g = Math.min(255, Math.round(g + (255 - g) * highlight));
          bl = Math.min(255, Math.round(bl + (255 - bl) * highlight));
        }

        // Inner bevel border highlight
        if (u < 0.08 || v < 0.08) {
          r = Math.min(255, r + 45);
          g = Math.min(255, g + 45);
          bl = Math.min(255, bl + 45);
        } else if (u > 0.92 || v > 0.92) {
          r = Math.max(0, r - 40);
          g = Math.max(0, g - 40);
          bl = Math.max(0, bl - 40);
        }

        return [r, g, bl, 255];
      }
    }
  }

  // Little golden sparkle in top-right
  const sparkX = nx - (isMaskable ? 0.78 : 0.82);
  const sparkY = ny - (isMaskable ? 0.22 : 0.18);
  const sparkDist = Math.sqrt(sparkX * sparkX + sparkY * sparkY);
  if (sparkDist < 0.04) {
    const sInt = 1 - sparkDist / 0.04;
    return [
      Math.min(255, Math.round(bgR + 240 * sInt)),
      Math.min(255, Math.round(bgG + 220 * sInt)),
      Math.min(255, Math.round(bgB + 60 * sInt)),
      255
    ];
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
console.log('Generating pwa-192x192.png...');
const png192 = writePng(192, 192, (x, y, w, h) => renderBlockBlastIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Generate 512x512
console.log('Generating pwa-512x512.png...');
const png512 = writePng(512, 512, (x, y, w, h) => renderBlockBlastIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// Generate 512x512 maskable (full bleed background, padded central graphic)
console.log('Generating pwa-maskable-512x512.png...');
const pngMaskable = writePng(512, 512, (x, y, w, h) => renderBlockBlastIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable);

// Generate Apple Touch Icon 180x180
console.log('Generating apple-touch-icon.png...');
const pngApple = writePng(180, 180, (x, y, w, h) => renderBlockBlastIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);

// Generate 32x32 for favicon.png
console.log('Generating favicon.png...');
const png32 = writePng(32, 32, (x, y, w, h) => renderBlockBlastIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.png'), png32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), png32);

console.log('All PWA icons generated successfully in public/');
