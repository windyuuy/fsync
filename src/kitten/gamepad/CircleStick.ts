
namespace kitten.gamepad {

	type Vector3 = fsync.Vector3
	const Vector3 = fsync.Vector3
	const UserInput = fsync.UserInput
	const Vector = fsync.Vector
	type BLRect = fsync.BLRect
	const BLRect = fsync.BLRect
	type IWHRectSpec = fsync.IWHRectSpec

	/**
	 * 环状摇杆
	 */
	export class CircleStick {

		/**
		 * 是否启用
		 */
		enable: boolean = true

		/**
		 * 控制器id
		 */
		identity: string = "unkown"

		/**
		* 控制器轴心起始位置
		*/
		protected ctrlPosOrigin: Vector3

		/**
		 * 获取输入端口列表
		 */
		getInputPorts() {
			return this.inputPorts
		}

		protected inputPorts: string[]
		protected updateInputPorts() {
			this.inputPorts = Object.keys(this.multiTouchMap).filter((key) => {
				return this.multiTouchMap[key] == this.identity
			})
		}

		get ctrlStatus() {
			return this.ctrlStatusRaw
		}

		/**
		 * 获取触控范围中心店
		 */
		getCtrlCenterPos() {
			return this.ctrlStatus.ctrlPos
		}

		protected lastCtrlStatus: StickLastCtrlState

		/**
		 * 控制器内部状态
		 */
		protected ctrlStatusRaw: StickCtrlState

		/**
		 * 控制器对外状态
		 */
		// ctrlStatus: StickCtrlState

		// resetExportStatus() {
		// 	this.ctrlStatus.pressed = false
		// 	this.ctrlStatus.touchAction = "loosed"
		// 	this.ctrlStatus.strength = 0
		// 	Vector.merge(this.ctrlStatus.ctrlPos, this.ctrlPosOrigin)
		// 	Vector.merge(this.ctrlStatus.touchPoint, this.ctrlPosOrigin)
		// 	Vector.resetValues(this.ctrlStatus.dir, 0)
		// }

		// /**
		//  * 导出状态
		//  */
		// exportTouchStatus() {
		// 	this.ctrlStatus.pressed = this.ctrlStatusRaw.pressed
		// 	Vector.merge(this.ctrlStatus.dir, this.ctrlStatusRaw.dir)
		// 	this.ctrlStatus.strength = this.ctrlStatusRaw.strength
		// 	this.ctrlStatus.touchAction = this.ctrlStatusRaw.touchAction
		// 	Vector.merge(this.ctrlStatus.touchPoint, this.ctrlStatusRaw.touchPoint)
		// 	Vector.merge(this.ctrlStatus.ctrlPos, this.ctrlStatusRaw.ctrlPos)
		// }

		updateStatus() {
			this.updateTouchAction()
			this.calcTouchVector()
			// this.exportTouchStatus()
		}

		updateTouchAction() {
			if (this.lastCtrlStatus.pressed) {
				if (this.ctrlStatusRaw.pressed) {
					// press -> press
					this.ctrlStatusRaw.touchAction = "move"
				} else {
					// press -> loosed
					this.ctrlStatusRaw.touchAction = "end"
				}
			} else {
				if (this.ctrlStatusRaw.pressed) {
					// loosed -> press
					this.ctrlStatusRaw.touchAction = "begin"
				} else {
					// loosed -> loosed
					this.ctrlStatusRaw.touchAction = "loosed"
				}
			}
			this.lastCtrlStatus.pressed = this.ctrlStatusRaw.pressed

		}

		/**
		 * 计算触摸矢量数据
		 */
		calcTouchVector() {
			const ctrlPos = this.ctrlStatusRaw.ctrlPos
			let pos = this.ctrlStatusRaw.touchPoint
			this.ctrlStatusRaw.dir.x = pos.x - ctrlPos.x
			this.ctrlStatusRaw.dir.y = pos.y - ctrlPos.y
			this.ctrlStatusRaw.strength = Vector.len(this.ctrlStatusRaw.dir)
		}

		init(id: string, sharedState: StickSharedState) {
			this.identity = id
			this.ctrlPosOrigin = new Vector3()
			this.touchRange = { height: 0, width: 0, x: 0, y: 0 }
			// this.ctrlStatus = new StickCtrlState()
			this.ctrlStatusRaw = new StickCtrlState()
			this.lastCtrlStatus = new StickLastCtrlState()
			this.inputPorts = []

			this.sharedState = sharedState

			return this
		}

		/**
		 * 动态设置当前摇杆中心点
		 * @param pos 
		 */
		setStartPos(pos: Vector3) {
			Vector.merge(this.ctrlStatusRaw.ctrlPos, pos)
		}

		/**
		 * 重置当前摇杆中心为原始中心点
		 */
		resetStartPos() {
			this.setStartPos(this.ctrlPosOrigin)
		}

		resetTouchPoint() {
			fsync.Vector.merge(this.ctrlStatusRaw.touchPoint, this.ctrlStatusRaw.ctrlPos)
		}

		/**
		 * 设置主视图
		 * @param pos 
		 */
		setStartPosOrigin(pos: Vector3) {
			Vector.merge(this.ctrlPosOrigin, pos)
			Vector.merge(this.ctrlStatusRaw.ctrlPos, pos)
		}

		/**
		 * 触控半径
		 */
		protected circleRadius: number = 10

		/**
		 * 设置触控半径
		 * @param radius 
		 */
		setCircleRadius(radius: number) {
			this.circleRadius = radius
		}

		/**
		 * 获取触控半径
		 * @param radius
		 */
		getCircleRadius() {
			return this.circleRadius
		}

		touchRange: IWHRectSpec

		/**
		 * 设置触控范围
		 * @param rect 
		 */
		setTouchRange(rect: IWHRectSpec) {
			this.touchRange.height = rect.height
			this.touchRange.width = rect.width
			this.touchRange.x = rect.x
			this.touchRange.y = rect.y
		}

		/**
		 * 获取触控范围
		 */
		protected getTouchRange(): IWHRectSpec {
			// let width = this.circleRadius
			// let height = this.circleRadius
			// return {
			// 	x: this.ctrlPos.x - width / 2,
			// 	y: this.ctrlPos.y - height / 2,
			// 	width: width,
			// 	height: height,
			// }
			return this.touchRange
		}

		/**
		 * 处理触控输入
		 * @param data 
		 */
		handlerInput(data: kitten.uievent.UserInputData): boolean {
			if (!this.enable) {
				this.cleanTouchMap()
				return false
			}

			if (this.detectVirtualCirleInput(data)) {
				// pass
			} else {
				return false
			}
			return true
		}

		cleanTouchMap() {
			for (let key in this.multiTouchMap) {
				delete this.sharedState.multiTouchMap[key]
			}
		}

		/**
		 * 触摸状态map
		 */
		protected multiTouchMap: { [id: string]: string } = fsync.EmptyTable()
		// protected static multiTouchMap: { [id: string]: string } = fsync.EmptyTable()
		protected sharedState: StickSharedState

		/**
		 * 检测虚拟手柄输入
		 * @param data 
		 */
		protected detectVirtualCirleInput(data: kitten.uievent.UserInputData): boolean {
			if (data.action == "ontouchstart") {
				for (let t of data.event.touches) {
					if (this.sharedState.multiTouchMap[t.identifier]) {
						continue
					}

					let pos = Vector3.fromNumArray([t.clientX, t.clientY])
					if (BLRect.containPoint(this.getTouchRange(), pos)) {
						this.sharedState.multiTouchMap[t.identifier] = this.identity
						this.multiTouchMap[t.identifier] = this.identity
						this.ctrlStatusRaw.pressed = true
						this.ctrlStatusRaw.touchPoint.x = pos.x
						this.ctrlStatusRaw.touchPoint.y = pos.y
						Vector.normalizeSelf(this.ctrlStatusRaw.dir)
					}
				}
			} else if (data.action == "ontouchend") {
				for (let t of data.event.touches) {
					if (this.multiTouchMap[t.identifier] == this.identity) {
						let pos = Vector3.fromNumArray([t.clientX, t.clientY])
						this.ctrlStatusRaw.pressed = false
						this.ctrlStatusRaw.touchPoint.x = pos.x
						this.ctrlStatusRaw.touchPoint.y = pos.y
						delete this.sharedState.multiTouchMap[t.identifier]
						delete this.multiTouchMap[t.identifier]
					}
				}
			} else if (data.action == "ontouchmove") {
				for (let t of data.event.touches) {
					if (this.multiTouchMap[t.identifier] == this.identity) {
						let pos = Vector3.fromNumArray([t.clientX, t.clientY])
						this.ctrlStatusRaw.touchPoint.x = pos.x
						this.ctrlStatusRaw.touchPoint.y = pos.y
						// this.ctrlStatus.dir.x = pos.x - this.ctrlPos.x
						// this.ctrlStatus.dir.y = pos.y - this.ctrlPos.y
						// this.ctrlStatus.strength = Vector.len(this.ctrlStatus.dir)
						Vector.normalizeSelf(this.ctrlStatusRaw.dir)
					}
				}
			} else {
				return false
			}
			return true
		}

	}

}
