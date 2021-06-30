
namespace fsync.box2d.b2data {

	/** undefined */
	export class PhysicsBoxCollider extends PhysicsCollider implements Box {
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;
		/** !#en Box size
		!#zh 包围盒大小 */
		size: Size;

		loadFromJson(json: PhysicsBoxCollider) {

			super.loadFromJson(json)
			this.offset = Vec2.fromNumArray(json.offset['data'])
			this.size = Size2.fromNumArray(json.size['data'])
		}
		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()

			Vector.multUpVar(this.offset, rptm)
			Vector.multUpVar(this.size, rptm)
		}

		createShape(mainBody: Box2DBody): b2.PolygonShape {

			let centerPt = this.calcShaptPtInMainBody(mainBody, this.offset)

			let angle = this.getInUnionRotationZ()

			let polygon = new b2.PolygonShape();
			polygon.SetAsBox(this.size.width / 2,
				this.size.height / 2,
				new b2.Vec2(centerPt.x,
					centerPt.y),
				angle);

			return polygon
		}

	}
}
