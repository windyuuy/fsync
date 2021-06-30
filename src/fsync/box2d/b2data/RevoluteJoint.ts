
namespace fsync.box2d.b2data {
	/** !#en
	A revolute joint constrains two bodies to share a common point while they
	are free to rotate about the point. The relative rotation about the shared
	point is the joint angle. You can limit the relative rotation with
	a joint limit that specifies a lower and upper angle. You can use a motor
	to drive the relative rotation about the shared point. A maximum motor torque
	is provided so that infinite forces are not generated.
	!#zh
	旋转关节可以约束两个刚体围绕一个点来进行旋转。
	你可以通过开启关节限制来限制旋转的最大角度和最小角度。
	你可以通过开启马达来施加一个扭矩力来驱动这两个刚体在这一点上的相对速度。 */
	export class RevoluteJoint extends Joint {
		/** !#en
		The reference angle.
		An angle between bodies considered to be zero for the joint angle.
		!#zh
		相对角度。
		两个物体之间角度为零时可以看作相等于关节角度 */
		referenceAngle: number;
		/** !#en
		The lower angle.
		!#zh
		角度的最低限制。 */
		lowerAngle: number;
		/** !#en
		The upper angle.
		!#zh
		角度的最高限制。 */
		upperAngle: number;
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
		Enable joint limit?
		!#zh
		是否开启关节的限制？ */
		enableLimit: boolean;
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;

		loadFromJson(json: RevoluteJoint) {
			super.loadFromJson(json)
			this.referenceAngle = json.referenceAngle * ANGLE_TO_PHYSICS_ANGLE
			this.lowerAngle = json.lowerAngle * ANGLE_TO_PHYSICS_ANGLE
			this.upperAngle = json.upperAngle * ANGLE_TO_PHYSICS_ANGLE
			this.maxMotorTorque = json.maxMotorTorque
			this.motorSpeed = json.motorSpeed
			this.enableLimit = json.enableLimit
			this.enableMotor = json.enableMotor
		}

		createJointDef(mainBodyModelA: Box2DBody, bodyModelA: Box2DBody, mainBodyModelB: Box2DBody, bodyModelB: Box2DBody) {

			let def = new b2.RevoluteJointDef()
			def.referenceAngle = this.referenceAngle
			def.enableLimit = this.enableLimit
			def.lowerAngle = this.lowerAngle
			def.upperAngle = this.upperAngle
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
			// 	def.localAnchorA.Set(flip * x, y)
			// }
			// {
			// 	let targetX = flip * this.connectedAnchor.x
			// 	let cosInc = Math.cos(angle)
			// 	let sinInc = Math.sin(angle)
			// 	let x = cosInc * targetX - sinInc * this.connectedAnchor.y;
			// 	let y = sinInc * targetX + cosInc * this.connectedAnchor.y;
			// 	def.localAnchorB.Set(flip * x, y)
			// }

			let anchorA = bodyModelA.calcJointAnchor(mainBodyModelA, this.anchor)
			def.localAnchorA.Set(anchorA.x, anchorA.y)
			let anchorB = bodyModelB.calcJointAnchor(mainBodyModelB, this.connectedAnchor)
			def.localAnchorB.Set(anchorB.x, anchorB.y)

			// if (this.bodyA.isBox) {
			// 	def.bodyA = mainBody;
			// 	def.localAnchorA.SelfAddXY(isFlip ? -this.bodyA.position.x : this.bodyA.position.x, this.bodyA.position.y);
			// } else {
			// 	def.bodyA = this.findBodyByDef(world, this.bodyA)
			// }

			// if (this.bodyB.isBox) {
			// 	def.bodyB = mainBody;
			// 	def.localAnchorB.SelfAddXY(isFlip ? -this.bodyB.position.x : this.bodyB.position.x, this.bodyB.position.y);
			// } else {
			// 	def.bodyB = this.findBodyByDef(world, this.bodyB)
			// }

			return def
		}
	}
}
