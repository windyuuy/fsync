
namespace lang {
	export const EmptyCall = function (): any { }

	export const EmptyTable = function () {
		return Object.create(null)
		// return {}
	}

	export function Clean<T extends Object>(container: T): T {
		if (container == null) {
			return container
		}

		if (container instanceof Array) {
			container.length = 0
		} else {
			for (let key of Object.keys(container)) {
				delete container[key]
			}
		}
		return container
	}
	export function CleanTable<T extends Object>(container: T): T {
		if (container == null) {
			return EmptyTable()
		} else {
			return Clean(container)
		}
	}
	export function CleanArray<T extends Object>(container: T[]): T[] {
		if (container == null) {
			return []
		} else {
			return Clean(container)
		}
	}

	const _copyDataDeep = (source: object, target: object) => {
		for (let key of Object.getOwnPropertyNames(source)) {
			// 清除溢出字段
			if (target[key] == null) {
				delete source[key]
			}
		}
		for (let key of Object.getOwnPropertyNames(target)) {
			let tvalue = target[key]
			if (tvalue == null) {
				source[key] = target[key]
			} else if (typeof (tvalue) == "object") {
				let svalue = source[key]
				if (typeof (svalue) != "object" || svalue == tvalue) {
					// 指向同一个对象或空，则重新创建新的
					svalue = {}
					source[key] = svalue
				}
				_copyDataDeep(svalue, tvalue)
			} else {
				if (source[key] != target[key]) {
					source[key] = target[key]
				}
			}
		}
	}

	export class ObjectUtils {
		/**
		 * 深度复制
		 * @param source 
		 * @param target 
		 */
		static copyDataDeep<T extends object>(source: T, target: T): T {
			if (target == null) {
				return null
			} else if (typeof (source) == "object" && typeof (target) == "object") {
				_copyDataDeep(source, target)
				return source
			} else {
				return target
			}
		}

		/**
		 * 浅克隆对象
		 * @param source 
		 */
		static clone<T extends object>(source: T): T {
			let target = EmptyTable()
			for (let key in source) {
				target[key] = source[key]
			}
			Object.setPrototypeOf(target, Object.getPrototypeOf(source))
			return target as T
		}

		static values<T extends object>(source: { [key: string]: T }): T[] {
			if (Object.values) {
				return Object.values(source)
			}

			let values = []
			for (let key of Object.keys(source)) {
				values.push(source[key])
			}
			return values
		}

		/**
		 * 计算项数
		 * @param source 
		 * @returns 
		 */
		static count(source: Object): number {
			let c = 0
			for (let key in source) {
				c++
			}
			return c
		}
	}
}