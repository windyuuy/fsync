namespace lang.helper {

	export class TArrayHelper {
		max<T>(ls: T[], call: (e: T) => number): T | undefined {
			let maxValue = -Infinity
			let maxEle = ls[0]
			for (let e of ls) {
				let value = call(e)
				if (maxValue <= value) {
					maxValue = value
					maxEle = e
				}
			}
			return maxEle
		}

		min<T>(ls: T[], call: (e: T) => number): T | undefined {
			let minValue = Infinity
			let minEle = ls[0]
			for (let e of ls) {
				let value = call(e)
				if (minValue >= value) {
					minValue = value
					minEle = e
				}
			}
			return minEle
		}

		remove<T>(ls: T[], e: T) {
			let index = ls.indexOf(e)
			if (index >= 0) {
				ls.splice(index, 1)
			}
		}

		/**
		 * 求出两列中差异的部分
		 * @param ls1 
		 * @param idGetter1 
		 * @param ls2 
		 * @param idGetter2 
		 * @param call 
		 */
		foreachDifferentPairs<T, F>(ls1: T[], idGetter1: (e: T) => string, ls2: F[], idGetter2: (e: F) => string, call: (e1: T, e2: F) => any) {
			const ls1Map: { [key: string]: T } = EmptyTable()
			const ls2Map: { [key: string]: F } = EmptyTable()
			ls1.forEach(e => {
				let id = idGetter1(e)
				ls1Map[id] = e
			})
			ls2.forEach(e => {
				let id = idGetter2(e)
				ls2Map[id] = e
			})
			for (let id in ls1Map) {
				const e1 = ls1Map[id]
				const e2 = ls2Map[id]
				call(e1, e2)
			}
			for (let id in ls2Map) {
				const e1 = ls1Map[id]
				const e2 = ls2Map[id]
				if (!(id in ls1Map)) {
					call(e1, e2)
				}
			}
		}

		sum<T>(ls: T[], call?: (n: T) => number): number {
			if (!call) {
				let n = 0
				for (let m of ls) {
					n += this.autoParseNumber(m)
				}
				return n
			} else {
				let n = 0
				for (let m of ls) {
					let ret = call(m)
					if (typeof (ret) == "number") {
						n += ret
					}
				}
				return n
			}
		}

		autoParseNumber(m: any): number {
			if (typeof (m) == "number") {
				return m
			} else if (typeof (m) == "string") {
				return parseFloat(m)
			} else {
				return m as any as number
			}
		}

		average<T>(ls: T[], call?: (n: T) => number): number {
			if (ls.length == 0) {
				return 0;
			}

			if (!call) {
				let n = 0
				for (let m of ls) {
					n += this.autoParseNumber(m)
				}
				let ave = n / ls.length
				return ave
			} else {
				let count = 0
				let n = 0
				for (let m of ls) {
					let ret = call(m)
					if (typeof (ret) == "number") {
						n += ret
						count++
					}
				}
				let ave = n / count
				return ave
			}
		}

	}

	export const ArrayHelper = new TArrayHelper()

}
