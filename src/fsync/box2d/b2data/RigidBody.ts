
namespace fsync.box2d.b2data {
	/** !#en Enum for RigidBodyType.
	!#zh 刚体类型 */
	export enum RigidBodyType {
		Static = 0,
		Kinematic = 0,
		Dynamic = 0,
		Animated = 0,
	}

	/** undefined */
	export class RigidBody extends Component {
		/** !#en
		Should enabled contact listener?
		When a collision is trigger, the collision callback will only be called when enabled contact listener.
		!#zh
		是否启用接触接听器。
		当 collider 产生碰撞时，只有开启了接触接听器才会调用相应的回调函数 */
		enabledContactListener: boolean;

		/** !#en
		Is this a fast moving body that should be prevented from tunneling through
		other moving bodies?
		Note :
		- All bodies are prevented from tunneling through kinematic and static bodies. This setting is only considered on dynamic bodies.
		- You should use this flag sparingly since it increases processing time.
		!#zh
		这个刚体是否是一个快速移动的刚体，并且需要禁止穿过其他快速移动的刚体？
		需要注意的是 :
		 - 所有刚体都被禁止从 运动刚体 和 静态刚体 中穿过。此选项只关注于 动态刚体。
		 - 应该尽量少的使用此选项，因为它会增加程序处理时间。 */
		bullet: boolean;
		/** !#en
		Rigidbody type : Static, Kinematic, Dynamic or Animated.
		!#zh
		刚体类型： Static, Kinematic, Dynamic or Animated. */
		type: RigidBodyType;
		/** !#en
		Set this flag to false if this body should never fall asleep.
		Note that this increases CPU usage.
		!#zh
		如果此刚体永远都不应该进入睡眠，那么设置这个属性为 false。
		需要注意这将使 CPU 占用率提高。 */
		allowSleep: boolean;
		/** !#en
		Scale the gravity applied to this body.
		!#zh
		缩放应用在此刚体上的重力值 */
		gravityScale: number;
		/** !#en
		Linear damping is use to reduce the linear velocity.
		The damping parameter can be larger than 1, but the damping effect becomes sensitive to the
		time step when the damping parameter is large.
		!#zh
		Linear damping 用于衰减刚体的线性速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。 */
		linearDamping: number;
		/** !#en
		Angular damping is use to reduce the angular velocity. The damping parameter
		can be larger than 1 but the damping effect becomes sensitive to the
		time step when the damping parameter is large.
		!#zh
		Angular damping 用于衰减刚体的角速度。衰减系数可以大于 1，但是当衰减系数比较大的时候，衰减的效果会变得比较敏感。 */
		angularDamping: number;
		/** !#en
		The linear velocity of the body's origin in world co-ordinates.
		!#zh
		刚体在世界坐标下的线性速度 */
		linearVelocity: Vec2;
		/** !#en
		The angular velocity of the body.
		!#zh
		刚体的角速度 */
		angularVelocity: number;
		/** !#en
		Should this body be prevented from rotating?
		!#zh
		是否禁止此刚体进行旋转 */
		fixedRotation: boolean;
		/** !#en
		Set the sleep state of the body. A sleeping body has very low CPU cost.(When the rigid body is hit, if the rigid body is in sleep state, it will be immediately awakened.)
		!#zh
		设置刚体的睡眠状态。 睡眠的刚体具有非常低的 CPU 成本。（当刚体被碰撞到时，如果刚体处于睡眠状态，它会立即被唤醒） */
		awake: boolean;
		/** !#en
		Whether to wake up this rigid body during initialization
		!#zh
		是否在初始化时唤醒此刚体 */
		awakeOnLoad: boolean;
		/** !#en
		Set the active state of the body. An inactive body is not
		simulated and cannot be collided with or woken up.
		If body is active, all fixtures will be added to the
		broad-phase.
		If body is inactive, all fixtures will be removed from
		the broad-phase and all contacts will be destroyed.
		Fixtures on an inactive body are implicitly inactive and will
		not participate in collisions, ray-casts, or queries.
		Joints connected to an inactive body are implicitly inactive.
		!#zh
		设置刚体的激活状态。一个非激活状态下的刚体是不会被模拟和碰撞的，不管它是否处于睡眠状态下。
		如果刚体处于激活状态下，所有夹具会被添加到 粗测阶段（broad-phase）。
		如果刚体处于非激活状态下，所有夹具会被从 粗测阶段（broad-phase）中移除。
		在非激活状态下的夹具不会参与到碰撞，射线，或者查找中
		链接到非激活状态下刚体的关节也是非激活的。 */
		active: boolean;

		loadFromJson(json: RigidBody) {
			super.loadFromJson(json)
			this.enabledContactListener = json.enabledContactListener
			this.bullet = json.bullet
			this.type = json.type
			this.allowSleep = json.allowSleep
			this.gravityScale = json.gravityScale
			this.linearDamping = json.linearDamping
			this.angularDamping = json.angularDamping
			this.linearVelocity = Vec2.fromNumArray(json.linearVelocity['data'])
			this.angularVelocity = json.angularVelocity * ANGLE_TO_PHYSICS_ANGLE
			this.fixedRotation = json.fixedRotation
			this.awake = json.awake
			this.awakeOnLoad = json.awakeOnLoad
			this.active = json.active
		}

		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()
			Vector.multUpVar(this.linearVelocity, rptm)
		}

		createBodyDef(): b2.BodyDef {
			var def = new b2.BodyDef()

			def.linearVelocity.Set(this.linearVelocity.x, this.linearVelocity.y)
			def.angularVelocity = this.angularVelocity;
			def.linearDamping = this.linearDamping
			def.angularDamping = this.angularDamping
			def.allowSleep = this.allowSleep
			def.awake = this.awake
			def.fixedRotation = this.fixedRotation
			def.bullet = this.bullet
			// def.type = rtype == RigidBodyType.Dynamic ? b2.BodyType.b2_dynamicBody : (rtype == RigidBodyType.Kinematic ? b2.BodyType.b2_kinematicBody : b2.BodyType.b2_staticBody);
			def.type = this.type as number as b2.BodyType
			def.active = this.active
			def.gravityScale = this.gravityScale

			return def
		}

		createBody(name: string, world: b2.World, zoneBodyDef: b2.BodyDef, unionId: string) {
			let zoneBody = world.CreateBody(zoneBodyDef)

			let userData: IBox2DBodyData = {
				name,
				mid: this.oid,
				oid: "unknown",
				contacts: [],
				unionId,
			}
			zoneBody.SetUserData(userData)
			return zoneBody
		}
	}
}
