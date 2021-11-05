
namespace lang {
	/**
	 * @noSelf
	 */
	export function assert<T>(cond: T, msg: string): T {
		if (!cond) {
			console.error(msg)
			debugger
		}
		return cond
	}

	/**
	 * @noSelf
	 */
	export function defaultValue<T>(kv: T, dv: T): T {
		return kv !== undefined ? kv : dv
	}

}
