
namespace lang.types {

	/**
	 * 列表结构只读的 Array
	 */
	export interface Tuple<T> {

		/**
		 * Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.
		 */
		length: number;
		/**
		 * Returns a string representation of an array.
		 */
		toString(): string;
		/**
		 * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
		 */
		toLocaleString(): string;
		/**
		 * Combines two or more arrays.
		 * @param items Additional items to add to the end of array1.
		 */
		concat(...items: ConcatArray<T>[]): T[];
		/**
		 * Combines two or more arrays.
		 * @param items Additional items to add to the end of array1.
		 */
		concat(...items: (T | ConcatArray<T>)[]): T[];
		/**
		 * Adds all the elements of an array separated by the specified separator string.
		 * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
		 */
		join(separator?: string): string;
		/**
		 * Returns a section of an array.
		 * @param start The beginning of the specified portion of the array.
		 * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
		 */
		slice(start?: number, end?: number): T[];
		/**
		 * Returns the index of the first occurrence of a value in an array.
		 * @param searchElement The value to locate in the array.
		 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
		 */
		indexOf(searchElement: T, fromIndex?: number): number;
		/**
		 * Returns the index of the last occurrence of a specified value in an array.
		 * @param searchElement The value to locate in the array.
		 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
		 */
		lastIndexOf(searchElement: T, fromIndex?: number): number;
		/**
		 * Determines whether all the members of an array satisfy the specified test.
		 * @param predicate A function that accepts up to three arguments. The every method calls
		 * the predicate function for each element in the array until the predicate returns a value
		 * which is coercible to the Boolean value false, or until the end of the array.
		 * @param thisArg An object to which the this keyword can refer in the predicate function.
		 * If thisArg is omitted, undefined is used as the this value.
		 */
		every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
		/**
		 * Determines whether all the members of an array satisfy the specified test.
		 * @param predicate A function that accepts up to three arguments. The every method calls
		 * the predicate function for each element in the array until the predicate returns a value
		 * which is coercible to the Boolean value false, or until the end of the array.
		 * @param thisArg An object to which the this keyword can refer in the predicate function.
		 * If thisArg is omitted, undefined is used as the this value.
		 */
		every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
		/**
		 * Determines whether the specified callback function returns true for any element of an array.
		 * @param predicate A function that accepts up to three arguments. The some method calls
		 * the predicate function for each element in the array until the predicate returns a value
		 * which is coercible to the Boolean value true, or until the end of the array.
		 * @param thisArg An object to which the this keyword can refer in the predicate function.
		 * If thisArg is omitted, undefined is used as the this value.
		 */
		some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
		/**
		 * Performs the specified action for each element in an array.
		 * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
		 * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
		 */
		forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
		/**
		 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
		 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
		 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
		 */
		map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
		/**
		 * Returns the value of the first element in the array where predicate is true, and undefined
		 * otherwise.
		 * @param predicate find calls predicate once for each element of the array, in ascending
		 * order, until it finds one where predicate returns true. If such an element is found, find
		 * immediately returns that element value. Otherwise, find returns undefined.
		 * @param thisArg If provided, it will be used as the this value for each invocation of
		 * predicate. If it is not provided, undefined is used instead.
		 */
		find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
		find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
		/**
		 * Returns the elements of an array that meet the condition specified in a callback function.
		 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
		 * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
		 */
		filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
		/**
		 * Returns the elements of an array that meet the condition specified in a callback function.
		 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
		 * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
		 */
		filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
		/**
		 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
		 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
		 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
		 */
		reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
		reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
		/**
		 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
		 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
		 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
		 */
		reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
		/**
		 * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
		 * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
		 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
		 */
		reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
		reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
		/**
		 * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
		 * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
		 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
		 */
		reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;

		readonly [n: number]: T;
	}
}
