

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

	mergeFrom(array: T[]): void

	equals(array: T[]): boolean;

	/**
	 * 从尾部追加
	 * @param source 
	 * @param offset 
	 */
	extend(source: Array<T>, offset?: number): this

	/**
	 * 判断元素是否已存在
	 * @param source 
	 * @param ele 
	 */
	exist(ele: T): boolean

	/**
	 * 按固定长度分割数组
	 * @param count 
	 */
	splitByCount(count: number): (Array<T>)[]

	/**
	 * 查找出最大的值
	 */
	max(callback: (a: T) => number): T

	/**
	 * 查找出最小的值
	 */
	min(callback: (a: T) => number): T

	/**
	 * 仅在尚不存在等值元素时，addUnique 才会向容器添加新元素
	 */
	addUnique(ele: T): boolean

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
	define(p, "mergeFrom", function (e) {
		for (let i = 0; i < e.length; i++) {
			this[i] = e[i]
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
	define(p, "exist", function (ele: any): boolean {
		return this.indexOf(ele) >= 0
	})
	define(p, "splitByCount", function (count: number): any[][] {
		let arrs = []
		for (let i = 0; i < this.length; i += count) {
			let arr = []
			arrs.push(arr)
			for (let j = i; j < i + count; j++) {
				arr.push(this[j])
			}
		}
		return arrs
	})

	var NULL = Symbol('null')
	define(p, "max", function (callback) {
		if (this.length <= 0) {
			return undefined
		}
		var maxItem = NULL
		var maxValue = undefined
		for (var i = 0; i < this.length; i++) {
			var element = this[i];
			var value = callback(element)
			if (maxItem == NULL || maxValue < value) {
				maxItem = element
				maxValue = value
			}
		}
		if (maxItem == NULL) {
			maxItem = undefined
		}
		return maxItem;
	})
	define(p, "min", function (callback) {
		if (this.length <= 0) {
			return undefined
		}
		var maxItem = NULL
		var maxValue = undefined
		for (var i = 0; i < this.length; i++) {
			var element = this[i];
			var value = callback(element)
			if (maxItem == NULL || maxValue > value) {
				maxItem = element
				maxValue = value
			}
		}
		if (maxItem == NULL) {
			maxItem = undefined
		}
		return maxItem;
	})
	define(p, "addUnique", function (ele: any): boolean {
		if (this.indexOf(ele) < 0) {
			this.push(ele)
			return true
		}
		return false
	})
})();