

interface Array<T> {
	/**
	 * 从列表中移除某个对象
	 */
	remove(item: T): Array<T>;

	/**
	 * 从列表中移除某个对象
	 */
	removeAt(index: number): void

	/**
	 * 计算某表达式的和
	 */
	sum(callback: (a: T) => number): number;

	/**
	 * 将二维数组降为一唯数组
	 * 例:[[1,2,3],[4,5,6]]=>[1,2,3,4,5,6]
	 */
	unpack(): T;

	/**
	 * 兼容es5浏览器
	 * @param callback 
	 */
	find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
	find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;

	pushList(array: T[]): T[]

	/**
	 * 清空元素, 容量清零
	 */
	clear(): void

	/**
	 * 判断是否包含元素
	 * @param item 
	 */
	contains<T>(item: T): boolean;

	/**
	 * 复制元素
	 * @param array 
	 * @param index 
	 */
	copyTo(array: T[], index?: number): void;

	equals(array: T[]): boolean;

	/**
	 * 从尾部追加
	 * @param source 
	 * @param offset 
	 */
	extend(source: Array<T>, offset?: number): this

}

(function () {
	const define = lang.objext.fixMissingAttr
	var p = Array.prototype

	define(p, "remove", function (value) {
		var index = this.indexOf(value)
		if (index != -1) {
			this.splice(index, 1)
		}
		return this;
	})
	define(p, "removeAt", function (index: number) {
		if (index >= 0) {
			this.splice(index, 1)
		}
		return this;
	})
	define(p, "sum", function (callback) {
		var sum = 0;
		for (var i = 0; i < this.length; i++) {
			var element = this[i];
			var value = callback(element)
			sum += value;
		}
		return sum;
	})
	define(p, "pushList", function (array) {
		this.push(...array)
		return this;
	})
	define(p, "unpack", function () {
		if (this[0] instanceof Array == false)
			return this;
		var a = this[0];
		for (var i = 1; i < this.length; i++) {
			a = a.concat(this[i]);
		}
		return a;
	})
	define(p, "find", function (callback, thisArg) {
		for (var i = 1; i < this.length; i++) {
			var e = callback(this[i], i, this)
			if (typeof (e) == "undefined") {
				e = thisArg
			}
			if (!!e) {
				return this[i]
			}
		}
		return undefined
	})
	define(p, "clear", function () {
		return this.length = 0
	})
	define(p, "contains", function (e) {
		return this.indexOf(e) != -1
	})
	define(p, "copyTo", function (e, start = 0) {
		for (var i = 0; i < this.length; i++) {
			e[start + i] = this[i]
		}
	})
	define(p, "equals", function (e): boolean {
		if (this.length != e.length) {
			return false;
		}
		for (var i = 0; i < this.length; i++) {
			if (this[i] != e[i]) {
				return false;
			}
		}
		return true;
	})
	define(p, "extend", function (a: Array<any>, offset: number): boolean {
		if (offset === undefined) {
			for (let i = 0; i < a.length; i++) {
				this.push(a[i])
			}
		} else {
			let selfLen = this.length
			for (let i = 0; i < a.length; i++) {
				this[selfLen + offset] = a[i]
			}
		}
		return this
	})
})();