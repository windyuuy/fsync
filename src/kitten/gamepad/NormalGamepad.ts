namespace kitten.gamepad {
	type Vector3 = fsync.Vector3
	const Vector3 = fsync.Vector3
	const UserInput = fsync.UserInput

	/**
	 * 虚拟游戏手柄
	 * - 虚拟设备
	 */
	export class NormalGamepad {

		protected enable: boolean = true

		/**
		 * 控制输入是否可用
		 */
		public get inputEnabled(): boolean {
			return this.enable
		}
		public set inputEnabled(value: boolean) {
			this.enable = value
		}

		/**
		 * 左手控制器
		 */
		get leftStick(): MoveStick {
			return this.virutalCtrls[0] as MoveStick
		}
		/**
		 * 左手控制器状态
		 */
		get leftStickStatus() {
			return this.leftStick.ctrlStatus
		}
		/**
		 * 右手控制器
		 */
		get rightStick(): MainSkillStick {
			return this.virutalCtrls[1] as MainSkillStick
		}
		/**
		 * 右手控制器状态
		 */
		get rightStickStatus() {
			return this.rightStick.ctrlStatus
		}

		/**
		 * 更新手柄状态,包含:
		 * - 延迟状态
		 */
		updateVirtualCtrls() {
			this.virutalCtrls.forEach((ctrl) => ctrl.updateStatus())

			// let inputMap: { [key: string]: CircleStick } = {}
			// let overwriteMap: { [key: string]: CircleStick } = {}
			// this.virutalCtrls.forEach((ctrl) => {
			// 	ctrl.getInputPorts().forEach((id) => {
			// 		overwriteMap[id] = ctrl
			// 		inputMap[ctrl.identity] = ctrl
			// 	})
			// })
			// let validMap = {}
			// Object.values(overwriteMap).forEach((ctrl) => {
			// 	validMap[ctrl.identity] = ctrl
			// })
			// // 排除掉被覆盖的输入摇杆
			// Object.values(inputMap).forEach((ctrl) => {
			// 	if (!validMap[ctrl.identity]) {
			// 		ctrl.resetExportStatus()
			// 	}
			// })
		}

		/**
		 * 摇杆列表
		 */
		virutalCtrls: CircleStick[]

		/**
		 * 摇杆共享状态
		 */
		sharedState: StickSharedState

		init() {

			this.sharedState = new StickSharedState()

			this.virutalCtrls = []
			{
				let ctrl = new MoveStick().init("movestick", this.sharedState)
				this.virutalCtrls[0] = ctrl

				let pos = new Vector3()
				pos.x = UserInput.inst.clientSize.x * 0.2
				pos.y = UserInput.inst.clientSize.y * 0.8
				// 默认设置在左边
				ctrl.setStartPosOrigin(pos)
			}
			{
				let ctrl = new MainSkillStick().init("skillstick", this.sharedState)
				this.virutalCtrls[1] = ctrl

				let pos = new Vector3()
				pos.x = UserInput.inst.clientSize.x * 0.8
				pos.y = UserInput.inst.clientSize.y * 0.8
				// 默认设置在右边
				ctrl.setStartPosOrigin(pos)
			}

			this.virtualCtrlViews = []

			UserInput.inst.addHandler("gamecontroller", (data) => {
				this.handlerInput(data)
			})
			return this
		}

		/**
		 * 触控调试视图列表
		 */
		protected virtualCtrlViews: CircleStickView[]

		/**
		 * 创建调试视图
		 */
		setupSimpleView() {

			{
				// 左
				let view = new CircleStickView().init()
				view.setupView(this.virutalCtrls[0], 'rgba(200, 255, 255, 1.0)')
				this.virtualCtrlViews[0] = view
			}
			{
				// 右
				let view = new CircleStickView().init()
				view.setupView(this.virutalCtrls[1], 'rgba(255, 200, 255, 1.0)')
				this.virtualCtrlViews[1] = view
			}

			for (let ctrl of this.virutalCtrls.slice(2)) {
				// 右
				let view = new CircleStickView().init()
				view.setupView(ctrl, 'rgba(255, 255, 200, 1.0)')
				this.virtualCtrlViews.push(view)
			}

		}

		/**
		 * 处理各类输入
		 * @param data 
		 */
		handlerInput(data: kitten.uievent.UserInputData): boolean {
			if (!this.enable) {
				return false
			}

			// if (data.action == "onsetup") {
			// 	this.setupSimpleView()
			// } else 
			{
				let b = false
				// for (let ctrl of this.virutalCtrls) {
				// for (let ctrl of this.virutalCtrls.reverse()) {
				for (let i = this.virutalCtrls.length - 1; i >= 0; i--) {
					let ctrl = this.virutalCtrls[i]
					let b2 = ctrl.handlerInput(data)
					b = b || b2
				}
				return b
			}
			return true
		}

	}
}