
namespace fsync.box2d.b2data {
	/** !#en
	A weld joint essentially glues two bodies together. A weld joint may
	distort somewhat because the island constraint solver is approximate.
	!#zh
	熔接关节相当于将两个刚体粘在了一起。
	熔接关节可能会使某些东西失真，因为约束求解器算出的都是近似值。 */
	export class WeldJoint extends Joint {
		/** !#en
		The reference angle.
		!#zh
		相对角度。 */
		referenceAngle: number;
		/** !#en
		The frequency.
		!#zh
		弹性系数。 */
		frequency: number;
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		dampingRatio: number;

		loadFromJson(json: WeldJoint) {
			super.loadFromJson(json)
			this.referenceAngle = json.referenceAngle
			this.frequency = json.frequency
			this.dampingRatio = json.dampingRatio
		}

		createJointDef(mainBodyModelA: Box2DBody, bodyModelA: Box2DBody, mainBodyModelB: Box2DBody, bodyModelB: Box2DBody): b2.WeldJointDef {

			let def = new b2.WeldJointDef()
			def.referenceAngle = this.referenceAngle
			def.frequencyHz = this.frequency
			def.dampingRatio = this.dampingRatio
			def.collideConnected = this.collideConnected

			let anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor)
			def.localAnchorA.Set(anchorA.x, anchorA.y)
			let anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor)
			def.localAnchorB.Set(anchorB.x, anchorB.y)

			return def
		}
	}
}
