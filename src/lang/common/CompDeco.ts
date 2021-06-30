namespace lang {

	let supportClassProguard: bool = true
	const detectClassProguard = (name: string, cls: new () => object): void => {
		if (cls != null) {
			if (cls.name != name) {
				supportClassProguard = false
			}
		}
	}
	export const setSupportClassProguard = (support: bool): void => {
		supportClassProguard = supportClassProguard && support
	}


	class _$ZAZ {
	}
	const ZAZClsName = _$ZAZ.name
	// 检测内部类名混淆
	detectClassProguard("_$ZAZ", _$ZAZ)

	/**
	 * 自定义类名反射
	 * @param name 
	 */
	export function cname(name: string) {
		return function <T>(cls: new () => T): any {
			if (!supportClassProguard) {
				Object.defineProperty(cls, "name", {
					value: name,
					writable: false,
				})
			}
			return cls
		}
	}

	let uid = 0;

	/**
	 * 自动录入唯一类名
	 */
	export function cid<T>(cls: new () => T): new () => T {
		if (!supportClassProguard) {
			uid++;
			Object.defineProperty(cls, "name", {
				value: `cid${uid}n`,
				writable: false,
			})
		}
		return cls
	}

}
