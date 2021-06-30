
namespace fsync.box2d.b2data {
	export class Transform extends ComponentBase {
		/**
		 * 相对坐标
		 */
		position: Vec3 = new Vec3()
		/**
		 * 旋转弧度/角度
		 * - 加载阶段会从cocos角度值转换为box2d内部使用的弧度值
		 */
		rotation: number = 0
		/**
		 * 按x轴翻转
		 */
		flip: TFlip = 1

		/**
		 * 从json加载box2d纯数据模型对象
		 * @param json 
		 */
		loadFromJson(json: Transform) {
			super.loadFromJson(json)

			this.position = Vec3.fromNumArray(json.position['data'])
			this.flip = json.flip
			this.rotation = json.rotation * ANGLE_TO_PHYSICS_ANGLE
		}

		/**
		 * 更新缩放倍率
		 */
		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()
			Vector.multUpVar(this.position, rptm)
		}

	}
}
