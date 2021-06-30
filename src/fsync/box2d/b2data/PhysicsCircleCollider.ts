
namespace fsync.box2d.b2data {

	/** undefined */
	export class PhysicsCircleCollider extends PhysicsCollider implements Circle {
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;
		/** !#en Circle radius
		!#zh 圆形半径 */
		radius: number;

		loadFromJson(json: PhysicsCircleCollider) {
			super.loadFromJson(json)
			this.offset = Vec2.fromNumArray(json.offset['data'])
			this.radius = json.radius
		}

		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()
			Vector.multUpVar(this.offset, rptm)
			this.radius = this.radius * rptm
		}

		createShape(mainBody: Box2DBody): b2.CircleShape {

			let shapePtInMainBody = this.calcShaptPtInMainBody(mainBody, this.offset)

			let cir = new b2.CircleShape()
			// cir.m_p.Set(shapePtInMainBody.x, shapePtInMainBody.y)
			cir.Set(new b2.Vec2(shapePtInMainBody.x, shapePtInMainBody.y), this.radius)

			return cir
		}

	}
}
