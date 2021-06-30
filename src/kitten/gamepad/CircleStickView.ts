namespace kitten.gamepad {
	type Vector3 = fsync.Vector3
	const Vector3 = fsync.Vector3
	const UserInput = fsync.UserInput
	const Vector = fsync.Vector

	/**
	 * 基础控制器视图
	 */
	export class CircleStickView {
		/**
		 * 对应控制器ID
		 */
		ctrlId: string
		protected circleView: graph.ISprite

		init() {
			return this
		}

		setupView(ctrl: CircleStick, color: string) {
			let length = Vector.len(UserInput.inst.clientSize)

			this.ctrlId = ctrl.identity
			this.circleView = graph.createSprite()
			this.circleView.setColor(color)
			this.circleView.setRadius(ctrl.getCircleRadius())
			let center = ctrl.getCtrlCenterPos()
			this.circleView.setPos(center.x, center.y)
		}

	}
}