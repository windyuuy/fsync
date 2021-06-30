namespace fsync {
	export interface IBLWHRectSpec {
		x: number,
		y: number,
		width: number,
		height: number,
	}

	/**
	 * BLRect = 左下角 + size
	 */
	export class BLRect {

		constructor(
			public x: number = 0,
			public y: number = 0,
			public width: number = 0,
			public height: number = 0,
		) {

		}

		static top(self: BLRect): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y + self.height)
		}

		static bottom(self: BLRect): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y)
		}

		static center(self: BLRect): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y + self.height / 2)
		}

		static fromRectLike({ x, y, width, height }: IBLWHRectSpec): BLRect {
			return new BLRect(x, y, width, height)
		}

		static copyRectLike(self: BLRect, { x, y, width, height }: IBLWHRectSpec): BLRect {
			self.x = x
			self.y = y
			self.width = width
			self.height = height
			return self
		}

		static reset(self: BLRect) {
			self.x = 0
			self.y = 0
			self.width = 0
			self.height = 0
			return self
		}

		static mergeFrom(self: BLRect, rect: BLRect) {
			self.width = rect.width
			self.height = rect.height
			self.x = rect.x
			self.y = rect.y
			return self
		}

		static clone(self: BLRect) {
			let rect = new BLRect()
			this.mergeFrom(rect, self)
			return rect
		}

		static containPoint(rect: BLRect, pt: IVector): boolean {
			let ns = pt.getBinData()
			let x = ns[0]
			let y = ns[1]
			if (
				(rect.x - x) * (rect.x + rect.width - x) <= 0
				&& (rect.y - y) * (rect.y + rect.height - y) <= 0
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
		static limitPointSelf(rect: BLRect, pt: IVector): void {
			let ns = pt.getBinData()
			let x = ns[0]
			let y = ns[1]
			if (x < rect.x) {
				x = rect.x
			}
			let rx = rect.x + rect.width
			if (x > rx) {
				x = rx
			}
			if (y < rect.y) {
				y = rect.y
			}
			let ry = rect.y + rect.height
			if (y > ry) {
				y = ry
			}
			ns[0] = x
			ns[1] = y
		}
	}

}