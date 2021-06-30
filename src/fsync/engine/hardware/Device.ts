namespace fsync {

	export class Device {
		get pixelRatio(): number {
			return window.devicePixelRatio
		}

		clientSize: Vector3

		get clientRect() {
			return {
				x: 0,
				y: 0,
				width: this.clientSize.x,
				height: this.clientSize.y,
			}
		}

		userEventHandlers: ((data: string) => void)[]

		init() {
			this.userEventHandlers = []
			this.clientSize = new Vector3()

			return this
		}
	}

	export const device = new Device().init()

}