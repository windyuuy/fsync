namespace kitten.gamepad {

	/**
	 * 主技能摇杆
	 */
	export class MainSkillStick extends GameStick {

		handlerInput(data: kitten.uievent.UserInputData): boolean {
			if (super.handlerInput(data)) {
				// pass
			} else if (this.detectSkillRollInput(data)) {
				// pass
			} else {
				return false
			}
			return true
		}

		/**
		 * 检测鼠标控制技能方向
		 * @param data 
		 */
		protected detectSkillRollInput(data: kitten.uievent.UserInputData): boolean {
			if (data.action == "onmousedown") {
				this.ctrlStatusRaw.pressed = true

			} else if (data.action == "onmouseup") {
				this.ctrlStatusRaw.pressed = false

			} else if (data.action == "onmousemove") {
				const ctrlPos = this.ctrlStatusRaw.ctrlPos
				let offset = [data.event.clientX - ctrlPos.x, data.event.clientY - ctrlPos.y]
				let strength = Math.sqrt(offset[0] * offset[0] + offset[1] * offset[1])
				this.ctrlStatusRaw.dir.x = offset[0] / strength
				this.ctrlStatusRaw.dir.y = offset[1] / strength
				this.ctrlStatusRaw.strength = strength
			} else {
				return false
			}
			return true
		}

	}
}