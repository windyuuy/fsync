
namespace fsync.box2d.b2data {

	export interface Box2DParent {
		transform: Transform
		parent: Box2DParent
	}

	/**
	 * 对应带有rigidbody组件的节点
	 */
	export class Box2DBody implements Box2DParent {

		updateParent() {
			this.transform.parent = this
			for (let child of this.components) {
				child.parent = this
			}

			let unionData = this.getUnionData()
			this.collisionGroup.setTeamInfo(unionData.team, unionData.totalTeams)
			this.collisionGroup.updateCollisionGroup()
		}

		name: string
		oid: string
		components: Component[] = []
		transform: Transform

		collisionGroup: CollisionGroup

		parent: Box2DNode

		/**
		 * 等待清理
		 */
		isSelfDead: bool
		isDead() {
			return this.isSelfDead || this.parent.isDead()
		}

		/**
		 * 缩放倍率
		 */
		PTM_RATIO: number = 1

		getNodeAngle() {
			return this.parent.transform.rotation
		}

		getBodyAngle() {
			return this.transform.rotation
		}

		getInUnionPosition2() {
			let bodyPos = Vec2.fromXYZLike(this.transform.position)
			bodyPos.x = bodyPos.x * this.getNodeFlip()
			let nodeAngle = this.parent.transform.rotation
			// node的旋转会对body的位置产生影响
			Vector.rotateSelfByZero2(bodyPos, nodeAngle)
			let nodePos = Vec2.fromXYZLike(this.parent.transform.position)
			Vector.addUp(bodyPos, nodePos)
			bodyPos.x = bodyPos.x * this.getUnionFlip()

			return bodyPos
		}

		getBodyFlip(): TFlip {
			return this.transform.flip
		}

		getNodeFlip(): TFlip {
			return this.parent.transform.flip
		}

		getUnionFlip(): TFlip {
			return this.parent.parent.transform.flip
		}

		getMainBodyPosInUnion() {
			return this.getInUnionPosition2()
		}

		getMainBodyPosInWorld() {
			let bodyPos = this.getMainBodyPosInUnion()
			let worldPos = this.getUnionData().calcPtInParent(bodyPos)
			return worldPos
		}

		/**
		 * 计算body上的点在union上的坐标
		 * @param shapePt 
		 */
		calcShapePtInUnion(shapePt: Vec2) {
			let selfBodyPosInNode = Vector2.fromXYZLike(this.transform.position)
			let selfNodePosInUnion = Vector2.fromXYZLike(this.parent.transform.position)
			let selfBodyAngleInNode = this.transform.rotation
			let selfNodeAngleInUnion = this.parent.transform.rotation
			let selfBodyAngleInUnion = selfBodyAngleInNode + selfNodeAngleInUnion

			// 算出node旋转产生的整体位移效应
			let rotatedOffset = selfBodyPosInNode.clone()
			// 应对node自身翻转
			rotatedOffset.x = rotatedOffset.x * this.getNodeFlip()
			Vector.rotateSelfByZero2(rotatedOffset, selfNodeAngleInUnion)
			// 叠加整体位移
			let bodyOffsetInUnion = Vector.addUp(selfNodePosInUnion.clone(), rotatedOffset)
			// 应对union自身翻转
			bodyOffsetInUnion.x = bodyOffsetInUnion.x * this.getUnionFlip()

			// 算出shape自身每个点的总旋转效应
			let shapePtInUnion = shapePt.clone()
			Vector.rotateSelfByZero2(shapePtInUnion, selfBodyAngleInUnion)
			// 应对node自身旋转
			shapePtInUnion.x = shapePtInUnion.x * this.getNodeFlip() * this.getUnionFlip()
			Vector.addUp(shapePtInUnion, bodyOffsetInUnion)
			return shapePtInUnion
		}

		calcShapePtInWorld(shapePt: Vec2) {
			let bodyPos = this.calcShapePtInUnion(shapePt)
			let worldPos = this.getUnionData().calcPtInParent(bodyPos)
			return worldPos
		}

		calcAngleInFixture(mainBody: Box2DBody) {
			return this.transform.rotation
		}

		calcFlipInMainBody(mainBody: Box2DBody) {
			return this.transform.flip * this.parent.transform.flip * this.parent.parent.transform.flip
		}

		calcShapePtInMainBody(mainBody: Box2DBody, shapePt: Vector2) {

			let bodyPosInWorld = mainBody.getMainBodyPosInUnion();

			let shapePtInWorld = this.calcShapePtInUnion(shapePt)

			let shapePtInMainBody = Vector.subDown(shapePtInWorld.clone(), bodyPosInWorld);
			return shapePtInMainBody;
		}

		calcJointAnchor(mainBody: Box2DBody, anchor: Vec2): Vec2 {
			return this.calcShapePtInMainBody(mainBody, anchor)
		}

		getPTMRatio() {
			if (this.parent) {
				return this.PTM_RATIO * this.parent.getPTMRatio()
			}
			return this.PTM_RATIO
		}

		findRigidBody(): RigidBody {
			return this.components.find(comp => comp instanceof RigidBody) as RigidBody
		}

		updatePTMRatio() {
			this.transform.updatePTMRatio()
			this.components.forEach((comp) => comp.updatePTMRatio())
		}

		getUnionData() {
			return this.parent.parent
		}

		loadFromJson(json: Box2DBody) {
			this.oid = json.oid
			this.name = json.name

			this.isSelfDead = false

			this.transform = new Transform()
			this.transform.loadFromJson(json.transform)

			this.collisionGroup = new CollisionGroup()
			this.collisionGroup.loadFromJson(json.collisionGroup)

			this.components = []
			for (let child of json.components) {
				let childCopy: b2data.Component
				switch (child.ctype) {
					case "cc_RigidBody":
						{
							childCopy = new RigidBody()
							break
						}
					case "cc_PhysicsBoxCollider":
						{
							childCopy = new PhysicsBoxCollider()
							break
						}
					case "cc_PhysicsCircleCollider":
						{
							childCopy = new PhysicsCircleCollider()
							break
						}
					case "cc_PhysicsPolygonCollider":
						{
							childCopy = new PhysicsPolygonCollider()
							break
						}
					case "cc_PhysicsBoxCollider":
						{
							childCopy = new PhysicsBoxCollider()
							break
						}
					case "cc_RevoluteJoint":
						{
							childCopy = new RevoluteJoint()
							break
						}
					case "cc_WheelJoint":
						{
							childCopy = new WheelJoint()
							break
						}
					case "cc_WeldJoint":
						{
							childCopy = new WeldJoint()
							break
						}
					default:
						console.warn("unsupport type", child.ctype)
				}

				if (childCopy) {
					childCopy.loadFromJson(child)
					this.components.push(childCopy)
				}
			}
		}
	}
}
