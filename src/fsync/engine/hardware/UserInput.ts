namespace fsync {

	export type UserInputData = {
		action: "onsetup" | "updateclientsize" | "onkeydown" | "onkeyup" | "onmousemove" | "onmousedown" | "onmouseup" | "ontouchmove" | "ontouchstart" | "ontouchend",
		event: {
			clientX?: number,
			clientY?: number,
			keyCode?: number,
			key?: string,
			touches?: {
				identifier: number,
				clientX?: number,
				clientY?: number,
			}[]
		},
		clientSize: {
			width: number,
			height: number,
		},
	}

	export type UserInputHandler = (data: UserInputData) => void

	const keyCodeMap = {
		[65]: 'a',
		[87]: 'w',
		[83]: 's',
		[68]: 'd',
		[32]: 'space',
		[66]: 'b',
	}
	export class UserInput {
		static readonly inst = new UserInput().init()

		protected eventHandlerMap: { [key: string]: UserInputHandler }

		protected eventHandler: (data: string) => void

		enable: boolean = true

		get clientSize(): Vector3 {
			return device.clientSize
		}
		init() {
			this.eventHandlerMap = EmptyTable()

			this.eventHandler = (sdata) => {
				const data = JSON.parse(sdata)

				if (!this.enable) {
					return
				}
				if (data.action == "updateclientsize") {
					this.clientSize.x = data.clientSize.width
					this.clientSize.y = data.clientSize.height
				}

				if (data.event.keyCode != null) {
					data.event.key = keyCodeMap[data.event.keyCode]
				}
				data.event.key = keyCodeMap[data.event.keyCode]
				for (let handler of Object.values(this.eventHandlerMap)) {
					try {
						handler(data)
					} catch (e) {
						console.error(e)
					}
				}
			}
			device.userEventHandlers.push(this.eventHandler)
			return this
		}

		addHandler(name: string, handler: UserInputHandler) {
			this.eventHandlerMap[name] = handler
		}
	}

}