
/**
 * 手势分析
 */
namespace kitten.uievent {
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

	export class UIEventHandler {

		protected _initOnce = false

		protected convertDesignX: (n: number) => number
		protected convertDesignY: (n: number) => number

		protected handlerEvent(data: UserInputData) {
			data.event.clientX = this.convertDesignX(data.event.clientX)
			data.event.clientY = this.convertDesignY(data.event.clientY)
			for (let t of data.event.touches || []) {
				t.clientX = this.convertDesignX(t.clientX)
				t.clientY = this.convertDesignY(t.clientY)
			}
			// console.log(data)

			for (let handler of fsync.device.userEventHandlers) {
				handler(JSON.stringify(data))
			}
		}

		bindUIEvents(force: boolean = false) {
			if (this._initOnce && (!force)) {
				return
			}
			this._initOnce = true

			const clientSize = fsync.device.clientSize
			let convertDesignX: (n: number) => number
			let convertDesignY: (n: number) => number

			function _initGraph() {
				// const screenWidth = document.body.clientWidth
				// const screenHeight = document.body.clientHeight
				const designWidth = clientSize.x
				const designHeight = clientSize.y

				const screenWidth = window.innerWidth
				const screenHeight = window.innerHeight
				console.log(screenWidth, screenHeight)
				const scaleX = screenWidth / designWidth
				const scaleY = screenHeight / designHeight
				const scaleMin = Math.min(scaleX, scaleY)
				const width = designWidth * scaleMin
				const height = designHeight * scaleMin

				console.log("screenSize:", screenWidth, screenHeight)
				console.log("deviceSize:", width, height)

				convertDesignX = (x: number) => {
					return (x - (screenWidth - width) / 2) / scaleMin
				}
				convertDesignY = (y: number) => {
					return (y - (screenHeight - height) / 2) / scaleMin
				}

			}
			_initGraph()

			this.convertDesignX = convertDesignX
			this.convertDesignY = convertDesignY

			let handlerEvent = (data: UserInputData) => {
				return this.handlerEvent(data)
			}

			try {
				document.onkeydown = (ev: KeyboardEvent) => {
					const data: UserInputData = {
						action: "onkeydown",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							keyCode: ev.keyCode,
							key: ev.key,
						}
					}
					handlerEvent(data)
				}

				document.onkeyup = (ev: KeyboardEvent) => {
					const data: UserInputData = {
						action: "onkeyup",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							keyCode: ev.keyCode,
							key: ev.key,
						}
					}
					handlerEvent(data)
				}
			} catch (e) {
				console.warn("document.onkeyXXX not support")
			}

			try {

				document.onmousedown = (ev: MouseEvent) => {
					const data: UserInputData = {
						action: "onmousedown",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							clientX: ev.clientX,
							clientY: ev.clientY,
						}
					}
					handlerEvent(data)
				}

				document.onmouseup = (ev: MouseEvent) => {
					const data: UserInputData = {
						action: "onmouseup",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							clientX: ev.clientX,
							clientY: ev.clientY,
						}
					}
					handlerEvent(data)
				}

				document.onmousemove = (ev: MouseEvent) => {
					const data: UserInputData = {
						action: "onmousemove",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							clientX: ev.clientX,
							clientY: ev.clientY,
						}
					}
					handlerEvent(data)
				}
			} catch (e) {
				console.warn("document.onmouseXXX not support")
			}

			try {

				document.ontouchstart = (ev: TouchEvent) => {
					const data: UserInputData = {
						action: "ontouchstart",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							touches: []
						}
					}
					for (let i = 0; i < ev.changedTouches.length; i++) {
						let t = ev.changedTouches[i]
						data.event.touches.push({
							identifier: t.identifier,
							clientX: t.clientX,
							clientY: t.clientY,
						})
					}
					handlerEvent(data)
				}

				document.ontouchend = (ev: TouchEvent) => {
					const data: UserInputData = {
						action: "ontouchend",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							touches: []
						}
					}
					for (let i = 0; i < ev.changedTouches.length; i++) {
						let t = ev.changedTouches[i]
						data.event.touches.push({
							identifier: t.identifier,
							clientX: t.clientX,
							clientY: t.clientY,
						})
					}
					handlerEvent(data)
				}

				document.ontouchmove = (ev: TouchEvent) => {
					const data: UserInputData = {
						action: "ontouchmove",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
							touches: []
						}
					}
					for (let i = 0; i < ev.changedTouches.length; i++) {
						let t = ev.changedTouches[i]
						data.event.touches.push({
							identifier: t.identifier,
							clientX: t.clientX,
							clientY: t.clientY,
						})
					}
					handlerEvent(data)
				}
			} catch (e) {
				console.warn("document.ontouchXXX not support")
			}

			try {
				document.body.onresize = (ev: UIEvent) => {
					const data: UserInputData = {
						action: "updateclientsize",
						clientSize: {
							width: clientSize.x,
							height: clientSize.y,
						},
						event: {
						}
					}
					handlerEvent(data)
				}
			} catch (e) {
				console.warn("document.body.onresize not support")
			}

		}

		postInitEvent(size: fsync.Vector3) {
			const clientSize = fsync.device.clientSize
			clientSize.x = size.x
			clientSize.y = size.y

			let handlerEvent = (data: UserInputData) => {
				return this.handlerEvent(data)
			}

			{
				const data: UserInputData = {
					action: "updateclientsize",
					clientSize: {
						width: clientSize.x,
						height: clientSize.y,
					},
					event: {
					}
				}
				handlerEvent(data)
			}
			{
				const data: UserInputData = {
					action: "onsetup",
					clientSize: {
						width: clientSize.x,
						height: clientSize.y,
					},
					event: {
					}
				}
				handlerEvent(data)
			}
		}
	}

	export const uiEventHandler = new UIEventHandler()
}
