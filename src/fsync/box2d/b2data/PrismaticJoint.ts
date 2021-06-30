
namespace fsync.box2d.b2data {
	/** !#en
	A prismatic joint. This joint provides one degree of freedom: translation
	along an axis fixed in rigidbody. Relative rotation is prevented. You can
	use a joint limit to restrict the range of motion and a joint motor to
	drive the motion or to model joint friction.
	!#zh
	移动关节指定了只能在一个方向上移动刚体。
	你可以开启关节限制来设置刚体运行移动的间距，也可以开启马达来使用关节马达驱动刚体的运行。 */
	export class PrismaticJoint extends Joint {
		/** !#en
		The local joint axis relative to rigidbody.
		!#zh
		指定刚体可以移动的方向。 */
		localAxisA: Vec2;
		/** !#en
		The reference angle.
		!#zh
		相对角度 */
		referenceAngle: number;
		/** !#en
		Enable joint distance limit?
		!#zh
		是否开启关节的距离限制？ */
		enableLimit: boolean;
		/** !#en
		Enable joint motor?
		!#zh
		是否开启关节马达？ */
		enableMotor: boolean;
		/** !#en
		The lower joint limit.
		!#zh
		刚体能够移动的最小值 */
		lowerLimit: number;
		/** !#en
		The upper joint limit.
		!#zh
		刚体能够移动的最大值 */
		upperLimit: number;
		/** !#en
		The maxium force can be applied to rigidbody to rearch the target motor speed.
		!#zh
		可以施加到刚体的最大力。 */
		maxMotorForce: number;
		/** !#en
		The expected motor speed.
		!#zh
		期望的马达速度。 */
		motorSpeed: number;

		loadFromJson(json: PrismaticJoint) {
			super.loadFromJson(json)
			this.localAxisA = Vec2.fromNumArray(json.localAxisA["data"])
			this.referenceAngle = json.referenceAngle * ANGLE_TO_PHYSICS_ANGLE
			this.enableLimit = json.enableLimit
			this.enableMotor = json.enableMotor
			this.lowerLimit = json.lowerLimit
			this.upperLimit = json.upperLimit
			this.maxMotorForce = json.maxMotorForce
			this.motorSpeed = json.motorSpeed
		}

		updatePTMRatio() {

			let rptm = 1 / this.getPTMRatio()

			this.lowerLimit = this.lowerLimit * rptm
			this.upperLimit = this.upperLimit * rptm
		}

		createJointDef(mainBodyModelA: Box2DBody, bodyModelA: Box2DBody, mainBodyModelB: Box2DBody, bodyModelB: Box2DBody): b2.PrismaticJointDef {

			let def = new b2.PrismaticJointDef()
			def.collideConnected = this.collideConnected
			def.enableMotor = this.enableMotor
			def.referenceAngle = this.referenceAngle;
			def.motorSpeed = this.motorSpeed
			def.enableLimit = this.enableLimit;
			def.lowerTranslation = this.lowerLimit;
			def.upperTranslation = this.upperLimit;
			def.maxMotorForce = this.maxMotorForce;

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

			def.localAxisA.Set(this.getWorldFlipY() * this.localAxisA.x, this.localAxisA.y)

			return def
		}

	}
}
