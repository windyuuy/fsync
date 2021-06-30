namespace fsync {

	export interface IWHRectSpec {
		x: number,
		y: number,
		width: number,
		height: number,
	}

	/**
	 * Rect = center + size
	 */
	export class Rect {

		constructor(
			public x: number = 0,
			public y: number = 0,
			public width: number = 0,
			public height: number = 0,
		) {

		}

		static top(self: Rect): Vector2 {
			return new Vector2(self.x, self.y + self.height / 2)
		}

		static bottom(self: Rect): Vector2 {
			return new Vector2(self.x, self.y - self.height / 2)
		}

		static center(self: Rect): Vector2 {
			return new Vector2(self.x, self.y)
		}

		static fromRectLike({ x, y, width, height }: IWHRectSpec): Rect {
			return new Rect(x, y, width, height)
		}

		static copyRectLike(self: Rect, { x, y, width, height }: IWHRectSpec): Rect {
			self.x = x
			self.y = y
			self.width = width
			self.height = height
			return self
		}

		static reset(self: Rect) {
			self.x = 0
			self.y = 0
			self.width = 0
			self.height = 0
			return self
		}

		static mergeFrom(self: Rect, rect: Rect) {
			self.width = rect.width
			self.height = rect.height
			self.x = rect.x
			self.y = rect.y
			return self
		}

		static clone(self: Rect) {
			let rect = new Rect()
			this.mergeFrom(rect, self)
			return rect
		}

		static containPoint(rect: Rect, pt: IVector): bool {
			let ns = pt.getBinData()
			let x = ns[0]
			let y = ns[1]
			if (
				(rect.x - rect.width / 2 - x) * (rect.x + rect.width / 2 - x) <= 0
				&& (rect.y - rect.height / 2 - y) * (rect.y + rect.height / 2 - y) <= 0
			) {
				return true
			} else {
				return false
			}
		}

		/**
		 * 将点就近限制在矩形框内
		 * @param rect 
		 * @param pt 
		 */
		static limitPointSelf(rect: Rect, pt: IVector): void {
			let ns = pt.getBinData()
			let x = ns[0]
			let y = ns[1]

			let lx = rect.x - rect.width / 2
			if (x < lx) {
				x = lx
			}
			let rx = rect.x + rect.width / 2
			if (x > rx) {
				x = rx
			}
			let ly = rect.y - rect.height / 2
			if (y < ly) {
				y = ly
			}
			let ry = rect.y + rect.height / 2
			if (y > ry) {
				y = ry
			}
			ns[0] = x
			ns[1] = y
		}
	}

}