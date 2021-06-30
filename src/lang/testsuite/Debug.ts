namespace lang.testsuite {

	export function assert<T>(cond: T, tip: string): T {
		if (!cond) {
			throw new Error(tip)
		}
		return cond
	}

	export function assert_true<T>(cond: T): T {
		if (!cond) {
			throw new Error(TestHelper.UNMATCHED_RESULT)
		}
		return cond
	}

	export function assert_equal(a: any, b: any): void {
		if (a != b) {
			throw new Error(TestHelper.UNMATCHED_RESULT + `: ${a} <- ${b}`)
		}
	}

	export function shall_crash(f: Function): void {
		let broken = false
		try {
			f()
		} catch (e) {
			broken = true
		}
		if (!broken) {
			throw new Error("function shall crash")
		}
	}

	export class TestHelper {
		static UNMATCHED_RESULT = "unmatched result"
	}

	export function testfunc(target: object, propName: string) {
		let funRaw = target[propName] as Function
		let className = target.constructor.name
		target[propName] = function (...args) {
			try {
				console.log("\n=================================")
				console.log(`${className}-${propName} TESTING`)
				let ret = funRaw.apply(this, args)
				console.log(`${className}-${propName} PASSED`)
				console.log("=================================\n")
				return ret
			} catch (e) {
				console.error(e)
				console.log(`${className}-${propName} FAILED`)
				console.log("=================================\n")
			}
		}
		return target[propName]
	}

	export function test_entry(desc: string, fun: () => void) {
		console.log(`==>> test entry<${desc}> BEGIN`)
		fun()
		console.log(`==<< test entry<${desc}> PASS`)
	}
}