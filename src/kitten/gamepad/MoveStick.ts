namespace kitten.gamepad {
	type Vector3 = fsync.Vector3
	const Vector3 = fsync.Vector3
	const UserInput = fsync.UserInput
	const Vector = fsync.Vector

	/**
	 * 移动摇杆
	 */
	export class MoveStick extends GameStick {

		handlerInput(data: kitten.uievent.UserInputData): boolean {
			if (super.handlerInput(data)) {
				// pass
			} else if (this.detectKeyboardMoveInput(data)) {
				// pass
			} else {
				return false
			}
			return true
		}

		/**
		* 获取输入端口列表
		*/
		getInputPorts() {
			let keys = super.getInputPorts()
			if (this.isKeyPressing) {
				keys.push("keyboard1")
			}
			return keys
		}

		protected pressingKeys: { [key: string]: boolean } = {}
		protected isKeyPressing: boolean = false

		protected updateKeyboardInputStatus() {
			let k = ["a", "d", "w", "s"].filter((kx) => this.pressingKeys[kx])
			if (k.length <= 0) {
				this.ctrlStatusRaw.pressed = false
				this.ctrlStatusRaw.strength = 0
			} else {
				this.ctrlStatusRaw.pressed = true
				this.ctrlStatusRaw.strength = 1
			}
			this.isKeyPressing = this.ctrlStatusRaw.pressed
		}

		/**
		 * 检测键盘输入控制
		 * @param data 
		 */
		protected detectKeyboardMoveInput(data: kitten.uievent.UserInputData): boolean {
			if (data.action == "onkeydown") {
				const key = data.event.key

				this.pressingKeys[key] = true
				this.updateKeyboardInputStatus()
				this.updateStatus()

				if (key == "a") {
					this.ctrlStatusRaw.dir.x = -1
					this.ctrlStatusRaw.dir.y = 0
				} else if (key == "d") {
					this.ctrlStatusRaw.dir.x = 1
					this.ctrlStatusRaw.dir.y = 0
				} else if (key == "w") {
					this.ctrlStatusRaw.dir.x = 0
					this.ctrlStatusRaw.dir.y = 1
				} else if (key == "s") {
					this.ctrlStatusRaw.dir.x = 0
					this.ctrlStatusRaw.dir.y = -1
				}
				Vector.addUp(Vector.merge(this.ctrlStatusRaw.touchPoint, this.ctrlStatusRaw.dir), this.ctrlStatusRaw.ctrlPos)

				this.updateKeyboardInputStatus()

			} else if (data.action == "onkeyup") {
				const key = data.event.key

				this.pressingKeys[key] = false

				this.updateKeyboardInputStatus()

			} else {
				return false
			}
			return true
		}

	}
}