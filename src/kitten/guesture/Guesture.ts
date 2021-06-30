
namespace kitten.guesture {
	export type TouchPoint = fsync.Vector3
	export const TouchPoint = fsync.Vector3

	export class ContinuoursIdTool {
		_idAcc: number = 0
		_idMap: { [key: string]: number } = {}
		/**
		 * 转化为可连续的id
		 * @param id 
		 */
		mapToContinuousId(id: string): number {
			let cid = this._idMap[id]
			if (cid == null) {
				cid = this._idMap[id] = this._idAcc++
			}
			return cid
		}

	}
	const idTool = new ContinuoursIdTool()

	export class TouchPointQueue {
		clearPoints() {
			this.points.length = 0
		}
		/**
		 * 触摸点列表，[0]表示最新存入的点
		 */
		protected points: TouchPoint[]

		init() {
			this.points = []
			return this
		}

		/**
		 * 存入最新的触摸点
		 * @param point 
		 */
		unshift(point: TouchPoint) {
			this.points.unshift(point)
		}

		/**
		 * 是否处于触摸状态
		 */
		touching: boolean = false
		/**
		 * 触摸点ID
		 */
		touchId: number = -1

		/**
		 * 触摸点列表，[0]表示最新存入的点
		 * @param num 
		 */
		getTopPoints(num: number = 2): TouchPoint[] {
			return this.points.slice(0, num)
		}

		/**
		 * 获取当前触摸点滑动方向
		 */
		getMoveVector(): TouchPoint {
			let vec = new TouchPoint(0)
			if (this.points.length > 1) {
				fsync.Vector.subDown(fsync.Vector.addUp(vec, this.points[0]), this.points[1])
			}
			return vec
		}
		/**
		 * 获取当前触摸点整体位移方向
		 */
		getMaxMoveVector(): TouchPoint {
			let vec = new TouchPoint(0)
			if (this.points.length > 1) {
				fsync.Vector.subDown(fsync.Vector.addUp(vec, this.points[0]), this.points[this.points.length - 1])
			}
			return vec
		}

		/**
		 * 获取
		 */
		getPoints(): TouchPoint[] {
			return this.points
		}
		/**
		 * 获取最新的点
		 * @param index 
		 */
		getPoint(index: number = 0): TouchPoint {
			return this.points[index]
		}
		/**
		 * 获取最老的点
		 * @param index
		 */
		getOldPoint(index: number = 0): TouchPoint {
			return this.points[this.points.length - 1 - index]
		}
	}

	/**
	 * 手势类型
	 */
	export enum GuestureTypes {
		/**
		 * 开始触摸
		 */
		touch = "touch",
		/**
		 * 点击
		 */
		loose = "loose",
		/**
		 * 拖拽
		 */
		drag = "drag",
		/**
		 * 双击
		 */
		doubleClick = "doubleClick",
		/**
		 * 缩放
		 */
		scale = "scale",
		/**
		 * 旋转
		 */
		rotate = "rotate",

	}

	export class GuestureInfo {
		gtype: GuestureTypes
	}

	/**
	 * 点触信息
	 */
	export class ClickGuestureInfo extends GuestureInfo {
		gtype = GuestureTypes.touch

		protected pointQueues: TouchPointQueue[]
		init(pointQueues: TouchPointQueue[]) {
			this.pointQueues = pointQueues
			return this
		}

	}

	/**
	 * 拖拽信息
	 */
	export class DragGuestureInfo extends GuestureInfo {
		gtype = GuestureTypes.drag

		protected pointQueues: TouchPointQueue[]
		init(pointQueues: TouchPointQueue[]) {
			this.pointQueues = pointQueues
			return this
		}

		getMoveVector(index: number = 0): TouchPoint {
			let points = this.pointQueues[index].getPoints()
			let vec = new TouchPoint()
			if (points.length > 1) {
				fsync.Vector.subDown(fsync.Vector.addUp(vec, points[0]), points[1])
			}
			return vec
		}
		getMaxMoveVector(index: number = 0): TouchPoint {
			let points = this.pointQueues[index].getPoints()
			let vec = new TouchPoint(0)
			if (points.length > 1) {
				fsync.Vector.subDown(fsync.Vector.addUp(vec, points[0]), points[points.length - 1])
			}
			return vec
		}

		getOldPoint(index: number = 0) {
			return this.pointQueues[this.pointQueues.length - 1].getOldPoint(index);
		}

		getPoint(index: number = 0) {
			return this.pointQueues[this.pointQueues.length - 1].getPoint(index);
		}

		getPoints(index: number = 0) {
			return this.pointQueues.map(pq => pq.getPoint(index))
		}
		getOldPoints(index: number = 0) {
			return this.pointQueues.map(pq => pq.getOldPoint(index))
		}
	}

	/**
	 * 双击信息
	 */
	export class DoubleClickGuestureInfo extends GuestureInfo {
		gtype = GuestureTypes.doubleClick

		protected pointQueues: TouchPointQueue[]
		init(pointQueues: TouchPointQueue[]) {
			this.pointQueues = pointQueues
			return this
		}

	}

	export type ScaleInfo = {
		scaleN: number
		dir: TouchPoint
		center: TouchPoint
	}

	/**
	 * 缩放信息
	 */
	export class ScaleGuestureInfo extends GuestureInfo {
		gtype = GuestureTypes.scale

		protected pointQueues: TouchPointQueue[]
		init(pointQueues: TouchPointQueue[]) {
			this.pointQueues = pointQueues
			return this
		}

		getScaleInfo(): ScaleInfo {
			let pq1 = this.pointQueues[0]
			let pq2 = this.pointQueues[1]
			let vec1 = pq1.getMaxMoveVector()
			let vec2 = pq2.getMaxMoveVector()
			let pt1_1 = pq1.getPoint()
			let pt1_2 = pq1.getOldPoint()
			let pt2_1 = pq2.getPoint()
			let pt2_2 = pq2.getOldPoint()
			let scaleN = fsync.Vector.distance(pt1_1, pt2_1) - fsync.Vector.distance(pt1_2, pt2_2)
			let dir = fsync.Vector.subDown(vec1.clone(), vec2)
			let center = fsync.Vector.addUp(pt1_2.clone(), pt2_2)
			let info: ScaleInfo = {
				center,
				dir,
				scaleN,
			}
			return info
		}

	}

	export type RotateInfo = {
		th: number
		rotation: number
		center: TouchPoint
	}
	/**
	 * 旋转信息
	 */
	export class RotateGuestureInfo extends GuestureInfo {
		gtype = GuestureTypes.rotate

		protected pointQueues: TouchPointQueue[]
		init(pointQueues: TouchPointQueue[]) {
			this.pointQueues = pointQueues
			return this
		}

		getRotateDirection(): RotateInfo {
			let pq1 = this.pointQueues[0]
			let pq2 = this.pointQueues[1]
			let pt1 = pq1.getOldPoint()
			let pt2 = pq2.getOldPoint()
			let distanceY = fsync.Vector.len(fsync.Vector.subDown(pt1.clone(), pt2))

			let vec1 = pq1.getMaxMoveVector()
			let vec2 = pq2.getMaxMoveVector()
			let distanceX = fsync.Vector.len(fsync.Vector.subDown(vec1.clone(), vec2))

			let th = Math.atan2(distanceX, distanceY)
			let center = fsync.Vector.addUp(pt1.clone(), pt2)

			let info: RotateInfo = {
				th: th,
				rotation: th / Math.PI * 180,
				center,
			}

			return info
		}

	}

	export class GuestureConfig {
		/**
		 * 最小移动距离
		 */
		dragDistanceMin: number = 1
		/**
		 * 
		 */
		rotateRadius: number = 170
	}

	/**
	 * 手势分析
	 */
	export class GuestureAnalyzer {
		protected pointQueues: TouchPointQueue[]
		protected config: GuestureConfig

		protected getActivedPointQueues() {
			return this.pointQueues.filter((queue) => {
				return queue.touching
			})
		}

		init() {
			this.pointQueues = []
			this.config = new GuestureConfig()
			return this
		}

		findTouchPointQueueById(id: number): TouchPointQueue | null {
			// 基本能完全预测准
			{
				let predictV = this.pointQueues[id]
				if (predictV && predictV.touchId == id) {
					return predictV
				}
			}

			for (let i in this.pointQueues) {
				let v = this.pointQueues[i]
				if (v.touchId == id) {
					// console.warn("missmatch", id, i)
					return v
				}
			}
			return null
		}

		/**
		 * 输入点触信息
		 * @param points 
		 */
		inputTouchPoints(touching: boolean, points: TouchPoint[]) {

			const pointQueues = this.pointQueues
			for (let i in points) {
				if (points[i] != null) {
					// let pq = pointQueues[i]
					let pqid = idTool.mapToContinuousId(i)
					let pq = this.findTouchPointQueueById(pqid)
					if (pq == null) {
						pq = new TouchPointQueue().init()
						pq.touchId = pqid
						// pointQueues[i] = pq
						pointQueues[pqid] = pq
					}
					if (!pq.touching) {
						pq.clearPoints()
					}
					pq.touching = touching
					pq.unshift(points[i])
				}
			}

		}

		/**
		 * 单点手势
		 */
		getSinglePointGuesture(): GuestureInfo | null {
			const config = this.config
			let pointQueues = this.getActivedPointQueues()
			let info: GuestureInfo = null
			if (pointQueues.length >= 1) {
				let pointQueue = pointQueues[0]
				if (fsync.Vector.len(pointQueue.getMaxMoveVector()) > config.dragDistanceMin) {
					let tinfo = new DragGuestureInfo()
					tinfo.init(pointQueues)
					info = tinfo
				} else {
					let tinfo = new ClickGuestureInfo()
					tinfo.gtype = GuestureTypes.touch
					tinfo.init(pointQueues)
					info = tinfo
				}
			} else {
				// 未触摸
				let tinfo = new ClickGuestureInfo()
				tinfo.gtype = GuestureTypes.loose
				tinfo.init(pointQueues)
				info = tinfo
			}
			return info
		}

		getTowPointGuesture(): GuestureInfo | null {
			const config = this.config
			const pointQueues = this.getActivedPointQueues()
			let info: GuestureInfo = null
			if (pointQueues.length == 2) {
				let pq1 = pointQueues[0]
				let pq2 = pointQueues[1]
				let moveVec1 = pq1.getMaxMoveVector()
				let moveVec2 = pq2.getMaxMoveVector()
				/**
				 * 计算点到直线距离
				 * @param index1 
				 * @param pt2 
				 */
				let calcDistance = (index1: number, pt2: TouchPoint) => {
					let pq = pointQueues[index1]
					let moveVec = pq.getMaxMoveVector()
					let pt = pq.getPoint(0)
					if (moveVec.x == 0) {
						return fsync.Vector.distance(pt, pt2)
					}
					let k = moveVec.y / moveVec.x
					let A = -k
					let B = 1
					let C = -pt.y + k * pt.x
					let d = Math.abs((A * pt2.x + B * pt2.y + C) / ((A * A + B * B) ** 0.5))
					return d
				}
				if (fsync.Vector.len(moveVec1) > config.dragDistanceMin || fsync.Vector.len(moveVec2) > config.dragDistanceMin) {
					// 计算点到直线距离
					let d1 = calcDistance(0, pq2.getPoint(0))
					let d2 = calcDistance(1, pq1.getPoint(0))
					if (d1 < config.rotateRadius || d2 < config.rotateRadius) {
						// 缩放操作
						let tinfo = new ScaleGuestureInfo()
						tinfo.init(pointQueues)
						info = tinfo
					} else {
						// 旋转力矩足够，旋转操作
						let tinfo = new RotateGuestureInfo()
						tinfo.init(pointQueues)
						info = tinfo
					}
				}
			} else {
				// 非双指操作
			}
			return info
		}

		/**
		 * 获取手势信息
		 */
		getCurrentGuesture(): GuestureInfo | null {
			let info: GuestureInfo = null

			const pointQueues = this.getActivedPointQueues()
			if (pointQueues.length >= 2) {
				info = this.getTowPointGuesture()
				if (info == null) {
					info = this.getSinglePointGuesture()
				}
			} else {
				info = this.getSinglePointGuesture()
			}
			return info
		}
	}
}
