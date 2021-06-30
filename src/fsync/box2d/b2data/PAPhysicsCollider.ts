namespace fsync.box2d.b2data {
	export const ANGLE_TO_PHYSICS_ANGLE = -Math.PI / 180;//在cocos中角度是反的，因此要加入-来转换
	export const PHYSICS_ANGLE_TO_ANGLE = -180 / Math.PI;

	/** !#en Collider component base class.
		!#zh 碰撞组件基类 */
	export class Collider extends Component {
		/** !#en Tag. If a node has several collider components, you can judge which type of collider is collided according to the tag.
		!#zh 标签。当一个节点上有多个碰撞组件时，在发生碰撞后，可以使用此标签来判断是节点上的哪个碰撞组件被碰撞了。 */
		tag: number;

		loadFromJson(json: Collider) {
			super.loadFromJson(json)
			this.tag = json.tag
		}
	}

	/** !#en Defines a Polygon Collider .
		!#zh 用来定义多边形碰撞体 */
	export interface Polygon {
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;
		/** !#en Polygon points
		!#zh 多边形顶点数组 */
		points: Vec2[];
	}

	/** undefined */
	export class PhysicsCollider extends Collider {
		/** !#en
		The density.
		!#zh
		密度 */
		density: number;
		/** !#en
		A sensor collider collects contact information but never generates a collision response
		!#zh
		一个传感器类型的碰撞体会产生碰撞回调，但是不会发生物理碰撞效果。 */
		sensor: boolean;
		/** !#en
		The friction coefficient, usually in the range [0,1].
		!#zh
		摩擦系数，取值一般在 [0, 1] 之间 */
		friction: number;
		/** !#en
		The restitution (elasticity) usually in the range [0,1].
		!#zh
		弹性系数，取值一般在 [0, 1]之间 */
		restitution: number;
		/** !#en
		Physics collider will find the rigidbody component on the node and set to this property.
		!#zh
		碰撞体会在初始化时查找节点上是否存在刚体，如果查找成功则赋值到这个属性上。 */
		body: RigidBody;

		/**
		 * 仅展示画面用
		 */
		displayKey?: string

		loadFromJson(json: PhysicsCollider) {
			super.loadFromJson(json)
			this.density = json.density
			this.sensor = json.sensor
			this.friction = json.friction
			this.restitution = json.restitution
			if (json.body) {
				this.body = new RigidBody()
				this.body.loadFromJson(json.body)
			}
		}

		createShape(mainBody: Box2DBody): b2.Shape {
			return null
		}

		createShapes(mainBody: Box2DBody): b2.Shape[] {
			return [this.createShape(mainBody)]
		}

		createFixtureDef(): b2.FixtureDef {
			var def = new b2.FixtureDef()

			def.density = this.density
			def.friction = this.friction
			def.isSensor = this.sensor
			def.restitution = this.restitution

			// def.filter.categoryBits = categoryBits ?? this.categoryBits
			// def.filter.maskBits = maskBits ?? this.maskBits
			// def.filter.groupIndex = groupIndex ?? this.groupIndex

			const collisionGroup = this.parent.collisionGroup
			if (collisionGroup.enabled) {
				def.filter.categoryBits = this.parent.collisionGroup.getCategoryBits()
				def.filter.maskBits = this.parent.collisionGroup.getMaskBits()
				def.filter.groupIndex = this.parent.collisionGroup.getGroupIndex()
			}

			return def

		}

		createFixture(zoneBody: b2.Body, fixtureDef: b2.FixtureDef, unionId: string) {
			let fixture = zoneBody.CreateFixture(fixtureDef)

			let userData: IBox2DFixtureData = {
				name: this.parent.name,
				mid: this.oid,
				oid: "unknown",
				contacts: [],
				unionId,
				displayKey: this.displayKey,
			}
			fixture.SetUserData(userData)
			return fixture
		}

		calcShaptPtInMainBody(mainBody: Box2DBody, shapePt: Vector2) {
			return this.parent.calcShapePtInMainBody(mainBody, shapePt)
		}

	}

}

