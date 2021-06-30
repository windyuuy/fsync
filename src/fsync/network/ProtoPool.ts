
namespace fsync {
	export class ProtoPool {
		protected protos: { [key: string]: string }
		init() {
			this.protos = EmptyTable()
			return this
		}
		put(key: string, content: string) {
			this.protos[key] = content
		}
		get(key: string): string {
			return this.protos[key]
		}
	}

	export const protoPool = new ProtoPool().init()
}
