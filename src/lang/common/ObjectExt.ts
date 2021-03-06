

// interface ObjectConstructor {
// 	/**
// 	 * Returns an array of values of the enumerable properties of an object
// 	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
// 	 */
// 	values<T>(o: { [s: string]: T } | ArrayLike<T>): T[];

// 	/**
// 	 * Returns an array of values of the enumerable properties of an object
// 	 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
// 	 */
// 	values(o: {}): any[];
// }

// (function () {
// 	const define = lang.objext.fixMissingAttr
// 	var p = Object.prototype

// 	define(p, "values", function* (value: Object) {
// 		// for (let key in value) {
// 		// 	yield value[key]
// 		// }
// 		let ls = []
// 		for (let key in value) {
// 			ls.push(value[key])
// 		}
// 		return ls
// 	})
// })();
