
namespace fsync.math {
	export function randomRange(min: number, max: number): number {
		return Math.random() * (max - min) + min
	}

	export function bezier3(C1: number, C2: number, C3: number, C4: number, t: number): number {
		const t1 = 1 - t;
		return C1 * t1 * t1 * t1 +
			C2 * 3 * t1 * t1 * t +
			C3 * 3 * t1 * t * t +
			C4 * t * t * t;
	}

	export function bezier2(C1: number, C2: number, C3: number, t: number): number {
		const t1 = 1 - t;
		return C1 * t1 * t1 +
			C2 * 2 * t1 * t +
			C3 * t * t;
	}

	export function bezier2Vec3(out: fsync.Vector3, vin: fsync.Vector3, C1: number, C2: number, C3: number) {
		out.x = bezier2(C1, C2, C3, vin.x)
		out.y = bezier2(C1, C2, C3, vin.y)
		out.z = bezier2(C1, C2, C3, vin.z)
	}

	export function minByAbs(v1: number, v2: number) {
		let v1abs = Math.abs(v1)
		let v2abs = Math.abs(v2)
		if (v1abs > v2abs) {
			return v2
		} else {
			return v1
		}
	}

	/**
	 * 2次贝塞尔曲线参数
	 */
	export type BezierParams2 = {
		/**
		 * 贝塞尔参数
		 */
		C1: number,
		C2: number,
		C3: number,
		/**
		 * 基础倍率
		 */
		speed: number,
	}

	/**
	 * 转换为脉冲信号
	 * @param th 
	 */
	export const getSign = (th: number) => {
		if (th == 0) {
			return 1
		} else {
			return th / Math.abs(th)
		}
	}

	/**
	 * 计算最小等价角度
	 * @param angle 
	 */
	export const calcMinAngle = (angle: number) => {
		angle = angle % 360
		if (angle > 180) {
			return angle - 360
		} else if (angle < -180) {
			return angle + 360
		} else {
			return angle
		}
	}
}
