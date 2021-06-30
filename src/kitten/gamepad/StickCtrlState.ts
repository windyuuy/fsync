namespace kitten.gamepad {
	type Vector3 = fsync.Vector3
	const Vector3 = fsync.Vector3
	const UserInput = fsync.UserInput

	/**
	* 操控状态
	* - move 移动中
	* - begin 刚开始点击
	* - end 刚刚松开
	* - loosed 松开状态
	*/
	export type TTouchAction = "move" | "begin" | "end" | "loosed"

	/**
	 * 前一次摇杆状态
	 */
	export class StickLastCtrlState {
		pressed: boolean = false
	}

	/**
	 * 摇杆状态
	 */
	export class StickCtrlState {
		/**
		 * 当前触摸位置
		 */
		touchPoint: Vector3 = new Vector3()
		/**
		 * 操控方向
		 */
		dir: Vector3 = new Vector3()
		/**
		 * 操作强度
		 */
		strength: number = 0
		/**
		 * 是否处于按下状态
		 */
		pressed: boolean = false
		/**
		 * 触摸操控状态
		 */
		touchAction: TTouchAction = "loosed"

		/**
		 * 控制器轴心位置
		 */
		ctrlPos: Vector3 = new Vector3()
	}
}