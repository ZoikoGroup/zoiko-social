/**
 * Pixel dimensions from the first bytes of an image.
 *
 * The news ingester needs this to refuse covers that are too small to render.
 * A feed's declared width is a claim — plenty of publishers omit it, and
 * Phys.org declares 90x90 on a `media:thumbnail` that really is 90x90 — so the
 * only trustworthy width is the one in the file itself.
 *
 * Deliberately not a dependency: the four container formats we accept all put
 * their dimensions in a fixed place near the front, and pulling in an image
 * library to read eight bytes would be the larger risk.
 */

export interface ImageDimensions {
  width: number
  height: number
}

/** PNG: IHDR is always the first chunk, at a fixed offset. */
function png(buf: Buffer): ImageDimensions | null {
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

/** GIF: logical screen descriptor, little-endian, right after the signature. */
function gif(buf: Buffer): ImageDimensions | null {
  if (buf.length < 10) return null
  if (buf.toString('ascii', 0, 3) !== 'GIF') return null
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
}

/**
 * WebP: three sub-formats, each storing size differently.
 *
 * VP8X (extended) holds width-1 and height-1 as 24-bit little-endian values;
 * VP8 (lossy) has them 14-bit after a 3-byte start code; VP8L (lossless) packs
 * both into 28 bits. Getting VP8X's off-by-one wrong would reject a 900px image
 * as 899px, which is the kind of bug that only shows up at a threshold.
 */
function webp(buf: Buffer): ImageDimensions | null {
  if (buf.length < 30) return null
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null

  const format = buf.toString('ascii', 12, 16)

  if (format === 'VP8X') {
    return {
      width: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
      height: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
    }
  }

  if (format === 'VP8 ') {
    // 3-byte start code at 23, then two 16-bit values whose low 14 bits are the
    // dimension and whose top 2 bits are a scaling hint we do not use.
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    }
  }

  if (format === 'VP8L') {
    const bits = buf.readUInt32LE(21)
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    }
  }

  return null
}

/**
 * JPEG: walk the segment chain to the first start-of-frame.
 *
 * There is no fixed offset — a file can carry EXIF, ICC profiles and comments
 * of arbitrary length before the frame header — so the markers have to be
 * followed. The loop is bounded by the buffer, and any malformed length lands
 * outside it and ends the walk rather than spinning.
 */
function jpeg(buf: Buffer): ImageDimensions | null {
  if (buf.length < 4) return null
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null

  let offset = 2
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset++
      continue
    }
    const marker = buf[offset + 1]!

    // SOF0-SOF15 carry the dimensions, except DHT (c4), JPG (c8) and DAC (cc),
    // which share the range but are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) }
    }

    // Standalone markers carry no length payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2
      continue
    }

    const length = buf.readUInt16BE(offset + 2)
    // A zero or nonsense length would leave the walk stuck on this byte.
    if (length < 2) return null
    offset += 2 + length
  }
  return null
}

/**
 * Reads an image's dimensions, or null when the bytes are not a format we
 * recognise or are truncated before the header.
 *
 * Null means "unknown", never "too small" — the caller decides what to do with
 * an unmeasurable image, and refusing every unparsed file would throw away
 * perfectly good covers in formats we simply do not inspect.
 */
export function readImageDimensions(buf: Buffer): ImageDimensions | null {
  const result = png(buf) ?? gif(buf) ?? webp(buf) ?? jpeg(buf)
  if (!result) return null
  // A parse that yields a zero dimension read something that was not a header.
  if (result.width <= 0 || result.height <= 0) return null
  return result
}
