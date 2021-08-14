
namespace lang.objext {
	export function fixMissingAttr(p: any, name: string, func: Function) {
		if (p[name] != null) {
			return;
		}
		try {
			Object.defineProperty(p, name, {
				value: func,
				enumerable: false
			})
		} catch (e) {

		}
	}
}
