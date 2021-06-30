namespace fsync {

	export interface ISize2Spec {
		width?: number
		height?: number
	}

	export class Size2 extends Vector2 {
		constructor(width?: number, height?: number) {
			super(width, height)
		}
		get width(): number {
			return this.x
		}
		set width(n: number) {
			this.x = n
		}
		get height(): number {
			return this.y
		}
		set height(n: number) {
			this.y = n
		}

		static fromSize2Like(size2: ISize2Spec): Size2 {
			let vec = new Size2().copySize2ike(size2)
			return vec
		}

		copySize2ike({ width, height }: ISize2Spec) {
			if (typeof (width) == "number") {
				this.x = width
			}
			if (typeof (height) == "number") {
				this.y = height
			}
			return this
		}

		static fromNumArray(ns: number[]): Size2 {
			let vec = new Size2()
			vec.data[0] = ns[0] || 0
			vec.data[1] = ns[1] || 0
			return vec
		}

	}

	export interface ISize3Spec {
		width?: number
		height?: number
		depth?: number
	}

	export class Size3 extends Vector3 {
		constructor(width?: number, height?: number, depth?: number) {
			super(width, height, depth)
		}
		get width(): number {
			return this.x
		}
		set width(n: number) {
			this.x = n
		}
		get height(): number {
			return this.y
		}
		set height(n: number) {
			this.y = n
		}
		get depth(): number {
			return this.z
		}
		set depth(n: number) {
			this.z = n
		}

		static fromSize3Like(size3: ISize3Spec): Size3 {
			let vec = new Size3().copySize3ike(size3)
			return vec
		}

		copySize3ike({ width, height, depth }: ISize3Spec) {
			if (typeof (width) == "number") {
				this.x = width
			}
			if (typeof (height) == "number") {
				this.y = height
			}
			if (typeof (depth) == "number") {
				this.z = depth
			}
			return this
		}

		static fromNumArray(ns: number[]): Size3 {
			let vec = new Size3()
			vec.data[0] = ns[0] || 0
			vec.data[1] = ns[1] || 0
			vec.data[2] = ns[2] || 0
			return vec
		}

	}

}