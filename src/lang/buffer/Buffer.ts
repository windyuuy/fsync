
namespace lang.helper {

	//#region funcs
	function asciiToBytes(str) {
		var byteArray = []
		for (var i = 0; i < str.length; ++i) {
			// Node's code seems to be doing this and not & 0x7F..
			byteArray.push(str.charCodeAt(i) & 0xFF)
		}
		return byteArray
	}

	function utf16leToBytes(str, units) {
		var c, hi, lo
		var byteArray = []
		for (var i = 0; i < str.length; ++i) {
			if ((units -= 2) < 0) break

			c = str.charCodeAt(i)
			hi = c >> 8
			lo = c % 256
			byteArray.push(lo)
			byteArray.push(hi)
		}

		return byteArray
	}

	function numberIsNaN(obj) {
		// For IE11 support
		return obj !== obj // eslint-disable-line no-self-compare
	}

	function blitBuffer(src, dst, offset, length) {
		for (var i = 0; i < length; ++i) {
			if ((i + offset >= dst.length) || (i >= src.length)) break
			dst[i + offset] = src[i]
		}
		return i
	}

	function hexWrite(buf, string, offset, length) {
		offset = Number(offset) || 0
		var remaining = buf.length - offset
		if (!length) {
			length = remaining
		} else {
			length = Number(length)
			if (length > remaining) {
				length = remaining
			}
		}

		var strLen = string.length

		if (length > strLen / 2) {
			length = strLen / 2
		}
		for (var i = 0; i < length; ++i) {
			var parsed = parseInt(string.substr(i * 2, 2), 16)
			if (numberIsNaN(parsed)) return i
			buf[offset + i] = parsed
		}
		return i
	}

	function utf8Write(buf, string, offset, length) {
		return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite(buf, string, offset, length) {
		return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write(buf, string, offset, length) {
		return asciiWrite(buf, string, offset, length)
	}

	function base64Write(buf, string, offset, length) {
		// return blitBuffer(base64ToBytes(string), buf, offset, length)
		throw new Error("unsupport function: base64Write")
	}

	function ucs2Write(buf, string, offset, length) {
		return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	function write(buf, string, offset, length = undefined, encoding = undefined) {
		// Buffer#write(string)
		if (offset === undefined) {
			encoding = 'utf8'
			length = buf.length
			offset = 0
			// Buffer#write(string, encoding)
		} else if (length === undefined && typeof offset === 'string') {
			encoding = offset
			length = buf.length
			offset = 0
			// Buffer#write(string, offset[, length][, encoding])
		} else if (isFinite(offset)) {
			offset = offset >>> 0
			if (isFinite(length)) {
				length = length >>> 0
				if (encoding === undefined) encoding = 'utf8'
			} else {
				encoding = length
				length = undefined
			}
		} else {
			throw new Error(
				'Buffer.write(string, encoding, offset[, length]) is no longer supported'
			)
		}

		var remaining = buf.length - offset
		if (length === undefined || length > remaining) length = remaining

		if ((string.length > 0 && (length < 0 || offset < 0)) || offset > buf.length) {
			throw new RangeError('Attempt to write outside buffer bounds')
		}

		if (!encoding) encoding = 'utf8'

		var loweredCase = false
		for (; ;) {
			switch (encoding) {
				case 'hex':
					return hexWrite(buf, string, offset, length)

				case 'utf8':
				case 'utf-8':
					return utf8Write(buf, string, offset, length)

				case 'ascii':
					return asciiWrite(buf, string, offset, length)

				case 'latin1':
				case 'binary':
					return latin1Write(buf, string, offset, length)

				case 'base64':
					// Warning: maxLength not taken into account in base64Write
					return base64Write(buf, string, offset, length)

				case 'ucs2':
				case 'ucs-2':
				case 'utf16le':
				case 'utf-16le':
					return ucs2Write(buf, string, offset, length)

				default:
					if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
					encoding = ('' + encoding).toLowerCase()
					loweredCase = true
			}
		}
	}

	function utf8ToBytes(str: string, units = undefined) {
		units = units || Infinity
		var codePoint
		var length = str.length
		var leadSurrogate = null
		var bytes = []

		for (var i = 0; i < length; ++i) {
			codePoint = str.charCodeAt(i)

			// is surrogate component
			if (codePoint > 0xD7FF && codePoint < 0xE000) {
				// last char was a lead
				if (!leadSurrogate) {
					// no lead yet
					if (codePoint > 0xDBFF) {
						// unexpected trail
						if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
						continue
					} else if (i + 1 === length) {
						// unpaired lead
						if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
						continue
					}

					// valid lead
					leadSurrogate = codePoint

					continue
				}

				// 2 leads in a row
				if (codePoint < 0xDC00) {
					if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
					leadSurrogate = codePoint
					continue
				}

				// valid surrogate pair
				codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
			} else if (leadSurrogate) {
				// valid bmp char, but last char was a lead
				if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
			}

			leadSurrogate = null

			// encode utf8
			if (codePoint < 0x80) {
				if ((units -= 1) < 0) break
				bytes.push(codePoint)
			} else if (codePoint < 0x800) {
				if ((units -= 2) < 0) break
				bytes.push(
					codePoint >> 0x6 | 0xC0,
					codePoint & 0x3F | 0x80
				)
			} else if (codePoint < 0x10000) {
				if ((units -= 3) < 0) break
				bytes.push(
					codePoint >> 0xC | 0xE0,
					codePoint >> 0x6 & 0x3F | 0x80,
					codePoint & 0x3F | 0x80
				)
			} else if (codePoint < 0x110000) {
				if ((units -= 4) < 0) break
				bytes.push(
					codePoint >> 0x12 | 0xF0,
					codePoint >> 0xC & 0x3F | 0x80,
					codePoint >> 0x6 & 0x3F | 0x80,
					codePoint & 0x3F | 0x80
				)
			} else {
				throw new Error('Invalid code point')
			}
		}

		return bytes
	}

	function byteLength(string, encoding) {
		var len = string.length
		var mustMatch = (arguments.length > 2 && arguments[2] === true)
		if (!mustMatch && len === 0) return 0

		// Use a for loop to avoid recursion
		var loweredCase = false
		for (; ;) {
			switch (encoding) {
				case 'ascii':
				case 'latin1':
				case 'binary':
					return len
				case 'utf8':
				case 'utf-8':
					return utf8ToBytes(string).length
				case 'ucs2':
				case 'ucs-2':
				case 'utf16le':
				case 'utf-16le':
					return len * 2
				case 'hex':
					return len >>> 1
				case 'base64':
					// return base64ToBytes(string).length
					throw new Error("byteLength: unsupport encoding: base64")
				default:
					if (loweredCase) {
						return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
					}
					encoding = ('' + encoding).toLowerCase()
					loweredCase = true
			}
		}
	}
	function isEncoding(encoding) {
		switch (String(encoding).toLowerCase()) {
			case 'hex':
			case 'utf8':
			case 'utf-8':
			case 'ascii':
			case 'latin1':
			case 'binary':
			case 'base64':
			case 'ucs2':
			case 'ucs-2':
			case 'utf16le':
			case 'utf-16le':
				return true
			default:
				return false
		}
	}
	var K_MAX_LENGTH = 0x7fffffff
	function createBuffer(length) {
		if (length > K_MAX_LENGTH) {
			throw new RangeError('The value "' + length + '" is invalid for option "size"')
		}
		// Return an augmented `Uint8Array` instance
		var buf = new Uint8Array(length)
		return buf
	}
	//#endregion

	export class BufferHelper {

		static concatUint8Array(ls: Uint8Array[]): Uint8Array {
			let len = 0
			for (let b of ls) {
				len += b.length
			}
			let m = new Uint8Array(len)
			let i = 0
			for (let b of ls) {
				for (let j = 0; j < b.length; j++) {
					m[i++] = b[j]
				}
			}
			return m
		}

		static from(str: string, encoding = undefined) {

			if (typeof encoding !== 'string' || encoding === '') {
				encoding = 'utf8'
			}

			if (!isEncoding(encoding)) {
				throw new TypeError('Unknown encoding: ' + encoding)
			}

			var length = byteLength(str, encoding) | 0
			var buf = createBuffer(length)

			var actual = write(buf, str, encoding)

			if (actual !== length) {
				// Writing a hex string, for example, that contains invalid characters will
				// cause everything after the first invalid character to be ignored. (e.g.
				// 'abxxcd' will be treated as 'ab')
				buf = buf.slice(0, actual as number)
			}

			return buf
		}

	}


}
