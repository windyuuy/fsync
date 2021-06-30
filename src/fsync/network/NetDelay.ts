namespace fsync {

	export class NetDelay {
		/**
		 * 延迟总值
		 */
		netDelayAcc = 0
		/**
		 * 方差总值
		 */
		netDelayDeviationAcc = 0
		netDelayQueue: number[] = []
		maxSampleCount: number = 15

		/**
		 * 输入网络延迟样本, 单位 秒
		 * @param delay 
		 */
		putDelay(delay: number) {
			this.netDelayAcc += delay
			this.netDelayDeviationAcc += Math.abs(delay - this.netDelayQueue[0] || delay)
			this.netDelayQueue.unshift(delay)
			if (this.netDelayQueue.length > this.maxSampleCount) {
				let d = this.netDelayQueue.pop()
				this.netDelayAcc -= d
				// 不严格的减法, 但是数值可以保持平衡
				this.netDelayDeviationAcc -= Math.abs(d - this.netDelayQueue[this.netDelayQueue.length - 1] || d)
				if (this.netDelayDeviationAcc < 0) {
					console.log("klwefjlkj")
				}
			}
		}

		/**
		 * 平均网络延迟, 单位 秒
		 */
		getDelayAv() {
			if (this.netDelayQueue.length == 0) {
				return 0
			}
			return this.netDelayAcc / this.netDelayQueue.length
		}

		/**
		 * 网络延迟标准差, 单位 秒
		 */
		getDelayStdDeviationAv() {
			if (this.netDelayQueue.length == 0) {
				return 0
			}
			return this.netDelayDeviationAcc / this.netDelayQueue.length
		}
	}

}