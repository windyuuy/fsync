
namespace fsync {
	export class Intervals {
		static readonly inst = new Intervals().init()
		intervals: any[]
		timeouts: any[]
		sw = { on: true }

		init() {
			this.intervals = []
			this.timeouts = []
			return this
		}

		setInterval(call: Function, duration: number) {
			let sw = this.sw
			this.intervals.push(setInterval(() => {
				if (sw.on == false) {
					return
				}
				call()
			}, duration))
		}

		clearAllInterval() {
			this.sw.on = false
			for (let id of this.intervals) {
				clearInterval(id)
			}
			this.sw = { on: true }
			this.intervals.length = 0
		}

		setTimeout(call: Function, duration: number) {
			this.timeouts.push(setTimeout(call, duration))
		}

		clearAllTimeout() {
			for (let id of this.timeouts) {
				clearTimeout(id)
			}
			this.timeouts.length = 0
		}

		clearAllTimer() {
			this.clearAllInterval()
			this.clearAllTimeout()
		}
	}
}