namespace fsync {

	export class UniqueIDTool implements IOverwritable, IMerge<UniqueIDTool> {
		init() {
			return this
		}

		rewrite(d: UniqueIDTool): bool {
			let newMap = EmptyTable()
			for (let key in d) {
				newMap[key] = d[key]
			}
			this.typeMap = newMap
			return true
		}
		protected typeMap: { [key: string]: int } = EmptyTable()

		genTypedId(t: string): string {
			let typeId = this.typeMap[t]
			if (typeId == null) {
				typeId = 0
			}
			typeId++
			this.typeMap[t] = typeId

			let uid = `${t}_#${typeId}`
			return uid
		}

		mergeFrom(tool: UniqueIDTool) {
			this.typeMap = EmptyTable()
			let targetTypeMap = tool.typeMap
			let myTypeMap = this.typeMap

			for (let key in targetTypeMap) {
				myTypeMap[key] = targetTypeMap[key]
			}
		}
	}

}