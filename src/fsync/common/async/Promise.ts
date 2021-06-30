namespace fsync {

/**
 * 反转 MyPromise
 * - 外部调用 success时相当于调用了 resolve
 * - 外部调用 fail 时，相当于调用了 reject
 * @param T - resolve 参数类型
 * @param F - reject 参数类型
 */
export class YmPromise<T, F = any> {
	/**
	 * @noSelf
	 */
	success: Function
	/**
	 * @noSelf
	 */
	fail: Function
	promise: Promise<T>
	constructor(params?: any) {
		this.init(params)
	}

	protected init(params?: any) {
		this.promise = new Promise((resolve, reject) => {
			this.success = resolve
			this.fail = reject
		})
	}
}

export class RPromise<T, F = any> extends YmPromise<T, F>{
	/**
	* @noSelf
	*/
	success: (value: T) => void
	/**
	* @noSelf
	*/
	fail: (value?: F) => void
}

}