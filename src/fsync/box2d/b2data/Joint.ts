namespace fsync.box2d.b2data {

	/** !#en
		Base class for joints to connect rigidbody.
		!#zh
		关节类的基类 */
	export class Joint extends Component {
		/** !#en
		The anchor of the rigidbody.
		!#zh
		刚体的锚点。 */
		anchor: Vec2;
		/** !#en
		The anchor of the connected rigidbody.
		!#zh
		关节另一端刚体的锚点。 */
		connectedAnchor: Vec2;
		/** !#en
		The rigidbody to which the other end of the joint is attached.
		!#zh
		关节另一端链接的刚体 */
		connectedBody: RigidBody;
		/** !#en
		Should the two rigid bodies connected with this joint collide with each other?
		!#zh
		链接到关节上的两个刚体是否应该相互碰撞？ */
		collideConnected: boolean;

		loadFromJson(json: Joint) {
			super.loadFromJson(json)

			this.anchor = Vec2.fromNumArray(json.anchor['data'])
			this.connectedAnchor = Vec2.fromNumArray(json.connectedAnchor['data'])
			this.connectedBody = new RigidBody()
			this.connectedBody.loadFromJson(json.connectedBody)
			this.collideConnected = json.collideConnected
		}

		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()
			Vector.multUpVar(this.anchor, rptm)
			Vector.multUpVar(this.connectedAnchor, rptm)
		}

		createJointDef(mainBodyModelA: Box2DBody, bodyModelA: Box2DBody, mainBodyModelB: Box2DBody, bodyModelB: Box2DBody): b2.JointDef {
			return null
		}

		createJoint(world: b2.World, jointDef: b2.JointDef, unionId: string) {
			let b2Joint = world.CreateJoint(jointDef)
			let userData: IBox2DJointData = {
				name: this.parent.name,
				mid: this.oid,
				oid: "unknown",
				unionId,
			}
			b2Joint.SetUserData(userData)
			return b2Joint
		}
	}
}
