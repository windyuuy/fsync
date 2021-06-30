
namespace fsync.box2d.b2data {
	/** !#en
	A wheel joint. This joint provides two degrees of freedom: translation
	along an axis fixed in bodyA and rotation in the plane. You can use a joint motor to drive
	the rotation or to model rotational friction.
	This joint is designed for vehicle suspensions.
	!#zh
	轮子关节提供两个维度的自由度：旋转和沿着指定方向上位置的移动。
	你可以通过开启关节马达来使用马达驱动刚体的旋转。
	轮组关节是专门为机动车类型设计的。 */
	export class WheelJoint extends Joint {
		/** !#en
		The local joint axis relative to rigidbody.
		!#zh
		指定刚体可以移动的方向。 */
		localAxisA: Vec2;
		/** !#en
		The maxium torque can be applied to rigidbody to rearch the target motor speed.
		!#zh
		可以施加到刚体的最大扭矩。 */
		maxMotorTorque: number;
		/** !#en
		The expected motor speed.
		!#zh
		期望的马达速度。 */
		motorSpeed: number;
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;
		/** !#en
		The spring frequency.
		!#zh
		弹性系数。 */
		frequency: number;
		/** !#en
		The damping ratio.
		!#zh
		阻尼，表示关节变形后，恢复到初始状态受到的阻力。 */
		dampingRatio: number;

		loadFromJson(json: WheelJoint) {
			super.loadFromJson(json)
			this.localAxisA = Vec2.fromNumArray(json.localAxisA['data'])
			this.maxMotorTorque = json.maxMotorTorque
			this.motorSpeed = json.motorSpeed
			this.enableMotor = json.enableMotor
			this.frequency = json.frequency
			this.dampingRatio = json.dampingRatio
		}

		createJointDef(mainBodyModelA: Box2DBody, bodyModelA: Box2DBody, mainBodyModelB: Box2DBody, bodyModelB: Box2DBody): b2.WheelJointDef {

			let def = new b2.WheelJointDef()
			def.frequencyHz = this.frequency
			def.dampingRatio = this.dampingRatio
			def.collideConnected = this.collideConnected
			def.enableMotor = this.enableMotor
			def.maxMotorTorque = this.maxMotorTorque
			def.motorSpeed = this.motorSpeed

			// {
			// 	let selfX = flip * this.anchor.x
			// 	let cosInc = Math.cos(angle)
			// 	let sinInc = Math.sin(angle)
			// 	let x = cosInc * selfX - sinInc * this.anchor.y;
			// 	let y = sinInc * selfX + cosInc * this.anchor.y;
			// 	def.localAnchorA.Set(flip * x + offsetA.x, y + offsetA.y)
			// }
			// {
			// 	// let targetX = flip * this.connectedAnchor.x
			// 	// let cosInc = Math.cos(angle)
			// 	// let sinInc = Math.sin(angle)
			// 	// let x = cosInc * targetX - sinInc * this.connectedAnchor.y;
			// 	// let y = sinInc * targetX + cosInc * this.connectedAnchor.y;
			// 	def.localAnchorB.Set(offsetB.x + 0.4, offsetB.y)
			// }

			let anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor)
			def.localAnchorA.Set(anchorA.x, anchorA.y)
			let anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor)
			def.localAnchorB.Set(anchorB.x, anchorB.y)

			def.localAxisA.Set(this.getWorldFlipY() * this.localAxisA.x, this.localAxisA.y)

			return def
		}
	}
}
