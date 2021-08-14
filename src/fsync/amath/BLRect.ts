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

		get centerX() {
			return this.x
		}

		get centerY() {
			return this.y
		}

		get top(): Vector2 {
			return Rect.top(this)
		}

		get bottom(): Vector2 {
			return Rect.bottom(this)
		}

		get center(): Vector2 {
			return Rect.center(this)
		}

		get leftX() {
			return this.x
		}

		get rightX() {
			return this.x + this.width
		}

		get left() {
			let self = this
			return new Vector2(self.x, self.y + this.height / 2)
		}

		get right() {
			let self = this
			return new Vector2(self.x + self.width, self.y + this.height / 2)
		}

		fromRectLike({ x, y, width, height }: IWHRectSpec): Rect {
			return Rect.fromRectLike(this)
		}

		copyRectLike(spec: IWHRectSpec): Rect {
			return Rect.copyRectLike(this, spec)
		}

		reset() {
			return Rect.reset(this)
		}

		mergeFrom(rect: Rect) {
			return Rect.mergeFrom(this, rect)
		}

		clone() {
			return Rect.clone(this)
		}

		containPoint(pt: IVector): bool {
			return Rect.containPoint(this, pt)
		}

		/**
		 * 将点就近限制在矩形框内
		 * @param rect 
		 * @param pt 
		 */
		limitPointSelf(pt: IVector): void {
			return Rect.limitPointSelf(this, pt)
		}

		static top(self: IWHRectSpec): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y + self.height)
		}

		static bottom(self: IWHRectSpec): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y)
		}

		static center(self: IWHRectSpec): Vector2 {
			return new Vector2(self.x + self.width / 2, self.y + self.height / 2)
		}

		static fromRectLike({ x, y, width, height }: IBLWHRectSpec): IWHRectSpec {
			return new BLRect(x, y, width, height)
		}

		static copyRectLike(self: IWHRectSpec, { x, y, width, height }: IBLWHRectSpec): IWHRectSpec {
			self.x = x
			self.y = y
			self.width = width
			self.height = height
			return self
		}

		static reset(self: IWHRectSpec) {
			self.x = 0
			self.y = 0
			self.width = 0
			self.height = 0
			return self
		}

		static mergeFrom(self: IWHRectSpec, rect: IWHRectSpec) {
			self.width = rect.width
			self.height = rect.height
			self.x = rect.x
			self.y = rect.y
			return self
		}

		static clone(self: IWHRectSpec) {
			let rect = new BLRect()
			this.mergeFrom(rect, self)
			return rect
		}

		static containPoint(rect: IWHRectSpec, pt: IVector): boolean {
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
		static limitPointSelf(rect: IWHRectSpec, pt: IVector): void {
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