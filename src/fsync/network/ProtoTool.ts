
namespace fsync {

	export class ProtoTool {
		protected root: protobuf.Root | null = null

		protoVersion: int32 = 0

		init(pkg: string) {
			this.package = pkg
			return this
		}

		parseProto(content: string, call: () => void) {
			let result = protobuf.parse(content)
			this.root = result.root
			const _ = call && call()
		}

		loadProto(srcFile: string, call: () => void) {
			const content = protoPool.get(srcFile)
			if (content != null) {
				this.parseProto(content, call)
			} else {
				protobuf.load(srcFile, (err, root) => {
					if (err) {
						throw err
					}
					this.root = root
					const _ = call && call()
				})
			}
		}

		package: string

		decode<T>(buffer: Uint8Array, cls: new () => T): T {
			let MessageProto = this.root.lookupType(`${this.package}.${cls.name}`)
			var message = MessageProto.decode(buffer);
			var object = MessageProto.toObject(message, {
				// longs: String,
				// enums: String,
				// bytes: String,
				// see ConversionOptions
			});
			return object as T
		}

		encode<T>(obj: T, cls: new () => T = null): Uint8Array {
			let clsName = cls == null ? obj.constructor.name : cls.name
			let MessageProto = this.root.lookupType(`${this.package}.${clsName}`)
			var errMsg = MessageProto.verify(obj);
			if (errMsg)
				throw Error(errMsg);

			// Create a new message
			var message = MessageProto.create(obj); // or use .fromObject if conversion is necessary

			// Encode a message to an Uint8Array (browser) or Buffer (node)
			var buffer = MessageProto.encode(message).finish();
			return buffer
		}
	}

}