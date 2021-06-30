
namespace lang.helper {

	export class TMapArrayHelper {
		filter<T>(m: { [key: string]: T }, call: (v: T, key: string) => any): T[] {
			let ls: T[] = []
			for (let key in m) {
				let v = m[key]
				if (call(v, key)) {
					ls.push(v)
				}
			}
			return ls
		}
	}

	export const MapArrayHelper = new TMapArrayHelper()

}
