namespace fsync {

	export class Timer implements IMerge<Timer> {
		/**
		 * 外界实际当前时间点
		 */
		protected _curTimeRecord: TTimeStamp = 0
		/**
		 * 游戏内部当前时间点
		 */
		protected _curTime: TTimeStamp = 0
		/**
		 * 当前帧间间隔
		 */
		protected _deltaTime: TTimeStamp = 0
		/**
		 * 最大帧间隔,用于提升断点调试体验
		 */
		protected _maxDeltaTime: TTimeStamp = Infinity
		/**
		 * 游戏开始时间点
		 */
		protected _startTime: TTimeStamp = 0
		/**
		 * 时间误差校准
		 */
		timerOffset: TTimeStamp = 0

		static oidAcc = 1
		oid: number = 0

		/**
		 * 初始化
		 * - oid
		 * @returns 
		 */
		init() {
			this.oid = Timer.oidAcc++
			return this
		}

		get realtime() {
			return Date.now()
		}

		get recordRealtime() {
			return this._curTimeRecord
		}

		/**
		 * 获取当前游戏时间戳
		 * - 和 getGameTime() 的区别在于, getGameTime 的起始时间点为 0, getTime 的起始时间点和游戏开始时的 Date.now() 基本一致
		 */
		getTime(): TTimeStamp {
			return this._curTime + this.timerOffset
		}

		updateTime(time: TTimeStamp) {
			const dt = time - this._curTimeRecord
			this._curTimeRecord = time
			this._deltaTime = Math.min(dt, this._maxDeltaTime)
			this._curTime = this._curTime + this._deltaTime
		}

		/**
		 * 重设游戏开始时间点
		 * @param time 
		 */
		setGameStartTime(time: TTimeStamp) {
			this._startTime = time
		}

		/**
		 * 游戏已进行时长
		 */
		getGameTime(): TTimeStamp {
			return this._curTime - this._startTime
		}

		/**
		 * 设置游戏起始时间和起始状态
		 * @param time 
		 */
		setStartTime(time: TTimeStamp) {
			this._curTimeRecord = time
			this._curTime = time
			this._deltaTime = 0
			this.setGameStartTime(time)
		}

		get deltaTime(): TTimeStamp {
			return this._deltaTime
		}

		mergeFrom(timer: Timer) {
			this._curTime = timer._curTime
			this._deltaTime = timer._deltaTime
		}

		setMaxDeltaTime(dt: TTimeStamp) {
			this._maxDeltaTime = dt
		}
	}

}