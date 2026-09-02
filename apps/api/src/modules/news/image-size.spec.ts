import { readImageDimensions } from './image-size'

/**
 * Reading dimensions out of image headers.
 *
 * The threshold this feeds decides whether a cover is shown or thrown away, so
 * an off-by-one or a silent null has visible consequences: a wrongly-rejected
 * cover leaves an article with no picture, and a wrongly-accepted 90px one is
 * the blurry card this was written to stop.
 */

/** A PNG needs only a signature and an IHDR for the dimensions to be readable. */
function pngOf(width: number, height: number): Buffer {
  const buf = Buffer.alloc(24)
  buf.writeUInt32BE(0x89504e47, 0)
  buf.writeUInt32BE(0x0d0a1a0a, 4)
  buf.write('IHDR', 12, 'ascii')
  buf.writeUInt32BE(width, 16)
  buf.writeUInt32BE(height, 20)
  return buf
}

function gifOf(width: number, height: number): Buffer {
  const buf = Buffer.alloc(13)
  buf.write('GIF89a', 0, 'ascii')
  buf.writeUInt16LE(width, 6)
  buf.writeUInt16LE(height, 8)
  return buf
}

/** VP8X stores width-1 / height-1 as 24-bit little-endian. */
function webpVp8xOf(width: number, height: number): Buffer {
  const buf = Buffer.alloc(32)
  buf.write('RIFF', 0, 'ascii')
  buf.write('WEBP', 8, 'ascii')
  buf.write('VP8X', 12, 'ascii')
  buf.writeUIntLE(width - 1, 24, 3)
  buf.writeUIntLE(height - 1, 27, 3)
  return buf
}

/**
 * A JPEG with `padding` bytes of junk segment before the frame header, so the
 * segment walk is genuinely exercised rather than reading a fixed offset.
 */
function jpegOf(width: number, height: number, padding = 0): Buffer {
  const parts: Buffer[] = [Buffer.from([0xff, 0xd8])]

  if (padding > 0) {
    const seg = Buffer.alloc(4 + padding)
    seg.writeUInt8(0xff, 0)
    seg.writeUInt8(0xe1, 1) // APP1, where EXIF lives
    seg.writeUInt16BE(2 + padding, 2)
    parts.push(seg)
  }

  const sof = Buffer.alloc(11)
  sof.writeUInt8(0xff, 0)
  sof.writeUInt8(0xc0, 1) // SOF0
  sof.writeUInt16BE(9, 2)
  sof.writeUInt8(8, 4) // precision
  sof.writeUInt16BE(height, 5)
  sof.writeUInt16BE(width, 7)
  parts.push(sof, Buffer.alloc(8))

  return Buffer.concat(parts)
}

describe('readImageDimensions', () => {
  it('reads a PNG', () => {
    expect(readImageDimensions(pngOf(1200, 630))).toEqual({ width: 1200, height: 630 })
  })

  it('reads a GIF', () => {
    expect(readImageDimensions(gifOf(800, 450))).toEqual({ width: 800, height: 450 })
  })

  it('reads a VP8X WebP without an off-by-one', () => {
    // The format stores width-1, so a naive read reports 899 for a 900px image
    // and the size threshold rejects it.
    expect(readImageDimensions(webpVp8xOf(900, 600))).toEqual({ width: 900, height: 600 })
  })

  it('reads a JPEG whose frame header is first', () => {
    expect(readImageDimensions(jpegOf(1024, 768))).toEqual({ width: 1024, height: 768 })
  })

  it('walks past EXIF to find a JPEG frame header', () => {
    // Real publisher JPEGs put kilobytes of metadata before the frame.
    expect(readImageDimensions(jpegOf(1600, 900, 4096))).toEqual({ width: 1600, height: 900 })
  })

  it('measures the 90x90 thumbnail this was written to catch', () => {
    expect(readImageDimensions(jpegOf(90, 90))).toEqual({ width: 90, height: 90 })
  })

  it('returns null for bytes that are not an image', () => {
    expect(readImageDimensions(Buffer.from('<!doctype html><html></html>'))).toBeNull()
  })

  it('returns null for an empty buffer rather than throwing', () => {
    expect(readImageDimensions(Buffer.alloc(0))).toBeNull()
  })

  it('returns null for a truncated header rather than guessing', () => {
    expect(readImageDimensions(pngOf(1200, 630).subarray(0, 18))).toBeNull()
  })

  it('does not hang on a JPEG with a nonsense segment length', () => {
    // A zero length would leave the walk parked on the same byte forever.
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    expect(readImageDimensions(buf)).toBeNull()
  })

  it('treats a zero dimension as unreadable', () => {
    expect(readImageDimensions(pngOf(0, 500))).toBeNull()
  })
})
