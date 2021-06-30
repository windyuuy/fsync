namespace fsync {

	const halfToRad = 0.5 * Math.PI / 180.0;

	export interface IVector extends IClone {
		getBinData(): number[]
		clone(): IVector
	}

	const _d2r = Math.PI / 180.0;

	const _r2d = 180.0 / Math.PI;

	export function toDegree(a: number) {
		return a * _r2d;
	}

	export class NumberArray {
		static lenSQ(ns: number[]) {
			let lsq = 0
			for (let i = 0; i < ns.length; i++) {
				lsq += ns[i] * ns[i]
			}
			return lsq
		}
		static len(ns: number[]) {
			let lsq = 0
			for (let i = 0; i < ns.length; i++) {
				lsq += ns[i] * ns[i]
			}
			return Math.sqrt(lsq)
		}

		/**
		 * 覆盖
		 * @param out 
		 * @param ns2 
		 */
		static merge(out: number[], ns2: number[]): number[] {
			for (let i = 0; i < ns2.length; i++) {
				out[i] = ns2[i]
			}
			return out
		}

		/**
		 * 最小合并
		 * @param ns1 
		 * @param ns2 
		 */
		static collect(ns1: number[], ns2: number[]): number[] {
			let count = Math.min(ns1.length, ns2.length)
			for (let i = 0; i < count; i++) {
				ns1[i] = ns2[i]
			}
			return ns1
		}

		static normalizeSelf(n1: number[]): number[] {
			let lsq = 0
			for (let i = 0; i < n1.length; i++) {
				lsq += n1[i] * n1[i]
			}
			if (lsq == 0) {
				for (let i = 0; i < n1.length; i++) {
					n1[i] = 0
				}
			} else {
				let l = Math.sqrt(lsq)
				for (let i = 0; i < n1.length; i++) {
					n1[i] /= l
				}
			}
			return n1
		}

		static transEulerToQuaternion(ns4: number[], ns3: number[]): number[] {
			let x = ns3[0]
			let y = ns3[1]
			let z = ns3[2]

			x *= halfToRad;
			y *= halfToRad;
			z *= halfToRad;

			const sx = Math.sin(x);
			const cx = Math.cos(x);
			const sy = Math.sin(y);
			const cy = Math.cos(y);
			const sz = Math.sin(z);
			const cz = Math.cos(z);

			ns4[0] = sx * cy * cz + cx * sy * sz;
			ns4[1] = cx * sy * cz + sx * cy * sz;
			ns4[2] = cx * cy * sz - sx * sy * cz;
			ns4[3] = cx * cy * cz - sx * sy * sz;

			return ns4;
		}

		static transQuaternionToEuler(ns3: number[], ns4: number[], outerZ?: boolean) {
			const x = ns4[0]
			const y = ns4[1]
			const z = ns4[2]
			const w = ns4[3]

			let bank = 0;
			let heading = 0;
			let attitude = 0;
			const test = x * y + z * w;
			if (test > 0.499999) {
				bank = 0; // default to zero
				heading = toDegree(2 * Math.atan2(x, w));
				attitude = 90;
			} else if (test < -0.499999) {
				bank = 0; // default to zero
				heading = -toDegree(2 * Math.atan2(x, w));
				attitude = -90;
			} else {
				const sqx = x * x;
				const sqy = y * y;
				const sqz = z * z;
				bank = toDegree(Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz));
				heading = toDegree(Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz));
				attitude = toDegree(Math.asin(2 * test));
				if (outerZ) {
					bank = -180 * Math.sign(bank + 1e-6) + bank;
					heading = -180 * Math.sign(heading + 1e-6) + heading;
					attitude = 180 * Math.sign(attitude + 1e-6) - attitude;
				}
			}

			// x
			ns3[0] = bank;
			// y
			ns3[1] = heading;
			// z
			ns3[2] = attitude;
			return ns3;
		}


		/**
		 * @zh 四元数乘法
		 */
		public static multiplyQuaternion(out: number[], a: number[], b: number[]) {
			const x = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1];
			const y = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2];
			const z = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0];
			const w = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];
			out[0] = x;
			out[1] = y;
			out[2] = z;
			out[3] = w;
			return out;
		}

	}

	export abstract class CommonVector implements IVector {
		abstract getBinData(): number[]
		abstract clone(): IVector

		distanceSQ(vec2: IVector): number {
			return Vector.distanceSQ(this, vec2)
		}

		distance(vec2: IVector): number {
			return Vector.distance(this, vec2)
		}

		equal(vec2: IVector): bool {
			return Vector.equal(this, vec2)
		}

		subDown<T extends IVector>(vec2: T): T {
			return Vector.subDown(this as any as T, vec2)
		}

		addUp<T extends IVector>(vec2: T): T {
			return Vector.addUp(this as IVector as T, vec2)
		}

		multUp<T extends IVector>(vec2: T): T {
			return Vector.multUp(this as IVector as T, vec2)
		}

		multUpVar(v: number) {
			return Vector.multUpVar(this, v)
		}

		multVar<T extends IVector>(v: number): T {
			return Vector.multVar(this as IVector as T, v)
		}

		normalizeSelf(): this {
			return Vector.normalizeSelf(this)
		}

		len<T extends IVector>(): number {
			return Vector.len(this as IVector as T)
		}

		/**
		 * 覆盖
		 * @param out 
		 * @param vec2 
		 */
		merge<T extends IVector>(vec2: T): T {
			return Vector.merge(this as IVector as T, vec2)
		}

		/**
		 * 最小合并
		 * @param vec1 
		 * @param vec2 
		 */
		collect<T extends IVector>(vec2: T): T {
			return Vector.collect(this as IVector as T, vec2)
		}

		/**
		 * @default value = 0
		 */
		resetValues(value: number = 0) {
			return Vector.resetValues(this, value)
		}

		/**
		 * 根据x，y决定的方向转换为角度 [-PI~PI]
		 * @param b 
		 */
		public getRotationZ2(): number {
			let data = this.getBinData()
			let th = Math.atan2(data[1], data[0])
			return th
		}

		/**
		 * 根据x，y决定的方向转换为角度 [-PI~PI]
		 * @param b 
		 */
		public getRotation2(): Vector3 {
			let data = this.getBinData()
			let th = Math.atan2(data[1], data[0])
			return fsync.Vector3.fromNumArray([0, 0, th])
		}

		/**
		 * 绕原点按笛卡尔坐标系弧度旋转
		 * @param out 
		 */
		public rotateSelfByZero2(angle: number) {
			let od = this.getBinData()
			let cosInc = Math.cos(angle)
			let sinInc = Math.sin(angle)
			let x = cosInc * od[0] - sinInc * od[1];
			let y = sinInc * od[0] + cosInc * od[1];
			od[0] = x
			od[1] = y
			return this
		}

		asVectorN<T extends IVector>(): T {
			return this as IVector as T
		}

		asVector2(): Vector2 {
			return this as IVector as Vector2
		}

		asVector3(): Vector3 {
			return this as IVector as Vector3
		}

		asVector4(): Vector4 {
			return this as IVector as Vector4
		}

	}

	export interface IVector2Like {
		x?: number
		y?: number
	}

	export class Vector2 extends CommonVector {
		protected data: number[] = [0, 0]

		static zero: Vector2 = new Vector2()

		static fromNumArray(ns: number[]): Vector2 {
			let vec = new Vector2()
			vec.data[0] = ns[0] || 0
			vec.data[1] = ns[1] || 0
			return vec
		}

		clone(): Vector2 {
			return Vector2.fromNumArray(this.getBinData())
		}

		/**
		 * Vector2.constructor
		 * @param x 默认等于 0
		 * @param y 默认等于 0
		 */
		constructor(x: number = 0, y: number = 0) {
			super()

			this.x = x
			this.y = y
		}

		/**
		 * vector的尺寸, vector2 为 2
		 */
		get size() {
			return 2
		}

		getBinData(): number[] {
			return this.data
		}

		setBinData(data: number[]) {
			this.data = data
		}

		public get x(): number {
			return this.data[0]
		}
		public set x(value: number) {
			this.data[0] = value
		}
		public get y(): number {
			return this.data[1]
		}
		public set y(value: number) {
			this.data[1] = value
		}

		copy(vec: IVector) {
			return Vector.merge(this, vec)
		}

		copyXYLike({ x, y }: { x?: number, y?: number }) {
			if (typeof (x) == "number") {
				this.x = x
			}
			if (typeof (y) == "number") {
				this.y = y
			}
		}

		static fromXYZLike({ x, y }: { x?: number, y?: number }): Vector2 {
			let vec = this.fromNumArray([x, y])
			return vec
		}

		mergeToXYZLike<T extends IVector2Like>(v?: T): T {
			const data = this.data
			v.x = data[0]
			v.y = data[1]
			return v
		}
	}

	export interface IVector3SpecInput {
		x?: number,
		y?: number,
		z?: number,
	}

	export class Vector3 extends CommonVector {
		protected data: number[] = [0, 0, 0]

		static zero: Vector3 = new Vector3()

		static fromNumArray(ns: number[]): Vector3 {
			let vec = new Vector3()
			const data = vec.data
			data[0] = ns[0] || 0
			data[1] = ns[1] || 0
			data[2] = ns[2] || 0
			return vec
		}

		copyNumArray(ns: number[]): Vector3 {
			const data = this.data
			data[0] = ns[0] || 0
			data[1] = ns[1] || 0
			data[2] = ns[2] || 0
			return this
		}

		clone(): Vector3 {
			return Vector3.fromNumArray(this.getBinData())
		}

		/**
		 * Vector3.constructor
		 * @param x 默认等于 0
		 * @param y 默认等于 0
		 * @param z 默认等于 0
		 */
		constructor(x: number = 0, y: number = 0, z: number = 0) {
			super()

			this.x = x
			this.y = y
			this.z = z
		}

		/**
		 * vector的尺寸, vector3 为 3
		 */
		get size() {
			return 3
		}

		getBinData(): number[] {
			return this.data
		}

		setBinData(data: number[]) {
			this.data = data
		}

		public get x(): number {
			return this.data[0]
		}
		public set x(value: number) {
			this.data[0] = value
		}
		public get y(): number {
			return this.data[1]
		}
		public set y(value: number) {
			this.data[1] = value
		}
		public get z(): number {
			return this.data[2]
		}
		public set z(value: number) {
			this.data[2] = value
		}

		copy(vec: IVector) {
			return Vector.merge(this, vec)
		}

		copyXYZLike({ x, y, z }: IVector3SpecInput) {
			if (typeof (x) == "number") {
				this.x = x
			}
			if (typeof (y) == "number") {
				this.y = y
			}
			if (typeof (z) == "number") {
				this.z = z
			}
			return this
		}

		static fromXYZLike({ x, y, z }: IVector3SpecInput): Vector3 {
			let vec = this.fromNumArray([x, y, z])
			return vec
		}

		toXYZLike<T extends IVector3SpecInput>(cls: new () => T): T {
			const v = new cls()
			const data = this.data
			v.x = data[0]
			v.y = data[1]
			v.z = data[2]
			return v
		}

		mergeToXYZLike<T extends IVector3SpecInput>(v: T): T {
			const data = this.data
			v.x = data[0]
			v.y = data[1]
			v.z = data[2]
			return v
		}
	}

	export class Vector4 extends CommonVector {
		protected data: number[] = [0, 0, 0, 0]

		static fromNumArray(ns: number[]): Vector4 {
			let vec = new Vector4()
			vec.data[0] = ns[0] || 0
			vec.data[1] = ns[1] || 0
			vec.data[2] = ns[2] || 0
			vec.data[3] = ns[3] || 0
			return vec
		}

		clone(): Vector4 {
			return Vector4.fromNumArray(this.getBinData())
		}

		/**
		 * Vector4.constructor
		 * @param x 默认等于 0
		 * @param y 默认等于 0
		 * @param z 默认等于 0
		 * @param w 默认等于 0
		 */
		constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
			super()

			this.x = x
			this.y = y
			this.z = z
			this.w = w
		}

		/**
		 * vector的尺寸, vector4 为 4
		 */
		get size() {
			return 4
		}

		getBinData(): number[] {
			return this.data
		}

		setBinData(data: number[]) {
			this.data = data
		}

		public get x(): number {
			return this.data[0]
		}
		public set x(value: number) {
			this.data[0] = value
		}
		public get y(): number {
			return this.data[1]
		}
		public set y(value: number) {
			this.data[1] = value
		}
		public get z(): number {
			return this.data[2]
		}
		public set z(value: number) {
			this.data[2] = value
		}
		public get w(): number {
			return this.data[3]
		}
		public set w(value: number) {
			this.data[3] = value
		}

		copy(vec: IVector) {
			return Vector.merge(this, vec)
		}

	}

	export const Quat = Vector4
	export type Quat = Vector4

	export class Vector {

		protected static _fromNumArray3(ns: number[]): Vector3 {
			let vec = new Vector3()
			vec.setBinData(ns)
			return vec
		}

		protected static _fromNumArray4(ns: number[]): Vector4 {
			let vec = new Vector4()
			vec.setBinData(ns)
			return vec
		}

		static distanceSQ(vec1: IVector, vec2: IVector): number {
			const n1 = vec1.getBinData()
			const n2 = vec2.getBinData()
			let total = 0
			for (let i = 0; i < Math.min(n1.length, n2.length); i++) {
				total += (n1[i] - n2[i]) * (n1[i] - n2[i])
			}
			return total
		}

		static distance(vec1: IVector, vec2: IVector): number {
			const total = this.distanceSQ(vec1, vec2)
			return Math.sqrt(total)
		}

		static equal(vec1: IVector, vec2: IVector): bool {
			const n1 = vec1.getBinData()
			const n2 = vec2.getBinData()
			if (n1.length != n2.length) {
				return false
			}

			for (let i = 0; i < n1.length; i++) {
				if (n1[i] != n2[i]) {
					return false
				}
			}
			return true
		}

		static subDown<T extends IVector>(vec1: T, vec2: T): T {
			const n1 = vec1.getBinData()
			const n2 = vec2.getBinData()
			for (let i = 0; i < Math.min(n1.length, n2.length); i++) {
				n1[i] -= n2[i]
			}
			return vec1
		}

		static addUp<T extends IVector>(vec1: T, vec2: T): T {
			const n1 = vec1.getBinData()
			const n2 = vec2.getBinData()
			for (let i = 0; i < Math.min(n1.length, n2.length); i++) {
				n1[i] += n2[i]
			}
			return vec1
		}

		static multUp<T extends IVector>(vec1: T, vec2: T): T {
			const n1 = vec1.getBinData()
			const n2 = vec2.getBinData()
			for (let i = 0; i < Math.min(n1.length, n2.length); i++) {
				n1[i] *= n2[i]
			}
			return vec1
		}

		static multUpVar<T extends IVector>(vec1: T, v: number): T {
			const n1 = vec1.getBinData()
			for (let i = 0; i < n1.length; i++) {
				n1[i] *= v
			}
			return vec1
		}

		static multVar<T extends IVector>(vec1: T, v: number): T {
			let newVec = new Vector3() as IVector
			const n1 = newVec.getBinData()
			const n2 = vec1.getBinData()
			for (let i = 0; i < n1.length; i++) {
				n1[i] = n2[i] * v
			}
			return newVec as T
		}

		static normalizeSelf<T extends IVector>(vec: T): T {
			const n1 = vec.getBinData()
			let lsq = 0
			for (let i = 0; i < n1.length; i++) {
				lsq += n1[i] * n1[i]
			}
			if (lsq == 0) {
				for (let i = 0; i < n1.length; i++) {
					n1[i] = 0
				}
			} else {
				let l = Math.sqrt(lsq)
				for (let i = 0; i < n1.length; i++) {
					n1[i] /= l
				}
			}
			return vec
		}

		static len<T extends IVector>(vec: T): number {
			const n1 = vec.getBinData()
			return NumberArray.len(n1)
		}

		/**
		 * 覆盖
		 * @param out 
		 * @param vec2 
		 */
		static merge<T extends IVector>(out: T, vec2: T): T {
			NumberArray.merge(out.getBinData(), vec2.getBinData())
			return out
		}

		/**
		 * 最小合并
		 * @param vec1 
		 * @param vec2 
		 */
		static collect<T extends IVector>(vec1: T, vec2: T): T {
			NumberArray.collect(vec1.getBinData(), vec2.getBinData())
			return vec1
		}

		static transEulerToQuaternion(quat: Vector4, vec3: Vector3) {
			NumberArray.transEulerToQuaternion(quat.getBinData(), vec3.getBinData())
			return quat
		}

		static transQuaternionToEuler(vec3: Vector3, quat: Vector4, outerZ?: boolean) {
			NumberArray.transQuaternionToEuler(vec3.getBinData(), quat.getBinData(), outerZ)
			return vec3
		}

		public static multiplyQuaternion(out: Vector4, a: Vector4, b: Vector4) {
			NumberArray.multiplyQuaternion(out.getBinData(), a.getBinData(), b.getBinData())
			return out
		}

		public static resetValues(vec: IVector, value: number = 0) {
			let ns = vec.getBinData()
			for (let i = 0; i < ns.length; i++) {
				ns[i] = value
			}
			return vec
		}

		/**
		 * 3维叉乘
		 * @param out 
		 * @param a 
		 */
		public static crossBy3(out: Vector3, a: Vector3) {
			const { x: ax, y: ay, z: az } = a;
			const { x: bx, y: by, z: bz } = out;
			out.x = ay * bz - az * by;
			out.y = az * bx - ax * bz;
			out.z = ax * by - ay * bx;
			return out;
		}

		public static dot(out: Vector3, a: Vector3): number {
			let n = 0
			let ns1 = out.getBinData()
			let ns2 = a.getBinData()
			let l = Math.min(ns1.length, ns2.length)
			for (let i = 0; i < l; i++) {
				n += (ns1[i] * ns2[i])
			}
			return n
		}

		/**
		 * 根据x，y决定的方向转换为角度 [-PI~PI]
		 * @param b 
		 */
		public static getRotationZ2(b: IVector): number {
			let data = b.getBinData()
			let th = Math.atan2(data[1], data[0])
			return th
		}

		/**
		 * 根据x，y决定的方向转换为角度 [-PI~PI]
		 * @param b 
		 */
		public static getRotation2(b: IVector): Vector3 {
			let data = b.getBinData()
			let th = Math.atan2(data[1], data[0])
			return fsync.Vector3.fromNumArray([0, 0, th])
		}

		/**
		 * 绕原点按笛卡尔坐标系弧度旋转
		 * @param out 
		 */
		public static rotateSelfByZero2(out: IVector, angle: number): IVector {
			let od = out.getBinData()
			let cosInc = Math.cos(angle)
			let sinInc = Math.sin(angle)
			let x = cosInc * od[0] - sinInc * od[1];
			let y = sinInc * od[0] + cosInc * od[1];
			od[0] = x
			od[1] = y
			return out
		}

		public static asVectorN<T extends IVector>(b: IVector): T {
			return b as T
		}

		public static asVector2(b: IVector): Vector2 {
			return b as Vector2
		}

		public static asVector3(b: IVector): Vector3 {
			return b as Vector3
		}

		public static asVector4(b: IVector): Vector4 {
			return b as Vector4
		}

	}

}