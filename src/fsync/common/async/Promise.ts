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
	export interface PPromise<T> extends Promise<T> {
		count: number
		total: number
		isFirstTimeUpdateProgress: boolean
		isWithProgress: boolean
		readonly progress
		onProgress(call: (count: number, total: number, diff: number, totalDiff: number, isFirst: boolean) => void)
		notifyProgress(count: number, total: number): void
		supportProgressAttr: boolean
	}
	const PPromise_Prototype = Promise.prototype as PPromise<any>

	Object.defineProperty(PPromise_Prototype, "supportProgressAttr", {
		value: true,
		writable: false,
	})
	PPromise_Prototype.count = 0
	PPromise_Prototype.total = 0
	PPromise_Prototype.isFirstTimeUpdateProgress = true
	Object.defineProperty(PPromise_Prototype, "progress", {
		get: function () {
			return this.count / this.total;
		}
	})
	Object.defineProperty(PPromise_Prototype, "onProgress", {
		value: function (call: (count: number, total: number, diff: number, totalDiff: number, isFirst: boolean) => void) {
			if (this.calls == undefined) {
				this.calls = []
			}
			this.calls.push(call)
		},
	})
	Object.defineProperty(PPromise_Prototype, "notifyProgress", {
		value: function (count: number, total: number) {
			let isFirst = this.isFirstTimeUpdateProgress
			if (isFirst) {
				this.isFirstTimeUpdateProgress = false
			}
			let diff = count - this.count
			let totalDiff = total - this.total
			this.count = count
			this.total = total
			if (this.calls) {
				this.calls.concat().forEach(call => {
					call(count, total, diff, totalDiff, isFirst)
				})
			}
		},
	})
	export function createPPromise<T>(exector: (resolve: (value: T) => void, reject: (reason?: any) => void) => void): PPromise<T> {
		return new Promise(exector) as PPromise<T>
	}
	export function toPPromise<T>(promise: Promise<T>): PPromise<T> {
		return promise as PPromise<T>
	}

}