namespace lang {

	/**
	 * Any compatible Long instance.
	 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
	 */
	export interface Long {

		/** Low bits */
		low: number;

		/** High bits */
		high: number;

		/** Whether unsigned or not */
		unsigned: boolean;

		toNumber(): number
	}

	export type int = number
	export type int32 = number
	export type int64 = number
	export type uint32 = number
	export type uint64 = number
	export type uint = number
	export type float32 = number
	export type float64 = number
	export type char = string
	export type bool = boolean

	export type TTimeStamp = int64

	export class LongHelper {
		static toNumber(n: Long | number): number {
			if (typeof (n) == "number") {
				return n
			} else {
				return n.toNumber()
			}
		}
	}

}