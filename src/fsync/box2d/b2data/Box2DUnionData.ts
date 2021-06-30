
namespace fsync.box2d.b2data {
	export class UnionSkinInfo {
		skinId: number = -1

		parent: Box2DUnionData

		loadFromJson(json: UnionSkinInfo) {
			this.skinId = json.skinId
		}

		getSkinId() {
			return this.skinId
		}

		setSkinId(skinId: number) {
			this.skinId = skinId
		}

	}

	export class Box2DUnionData implements IBox2DModel, Box2DParent {
		name: string
		/**
		 * 标签列表，可调试用
		 */
		tags: string[] = []
		transform: Transform = new Transform()

		parent: Box2DParent

		oid: string
		children: Box2DNode[] = []
		/**
		 * 关联信息
		 */
		fixedContacts: FixedContact[] = []
		/**
		 * 锚点主体
		 */
		bodyName: string

		/**
		 * 等待清理
		 */
		isSelfDead: bool
		isDead() {
			return this.isSelfDead
		}

		/**
		 * 缩放倍率
		 */
		PTM_RATIO: number = 1

		/**
		 * 队伍归属，用于碰撞分组
		 */
		team: number = 0
		/**
		 * 所有队伍
		 */
		totalTeams: number[] = []

		/**
		 * 皮肤信息
		 */
		skinInfo: UnionSkinInfo = new UnionSkinInfo()

		/**
		 * 外部关联信息
		 */
		outsideFixedContact: OutsideFixedContact = new OutsideFixedContact()

		calcPtInParent(pt: Vec2) {
			let unionAngle = this.transform.rotation
			let bodyOffset = Vector.rotateSelfByZero2(pt, unionAngle)
			let unionPos = this.transform.position
			let worldPos = Vector.addUp(Vector2.fromXYZLike(unionPos), bodyOffset)
			return worldPos
		}

		getPTMRatio() {
			return this.PTM_RATIO
		}

		updatePTMRatio() {
			if (this.transform) {
				this.transform.updatePTMRatio()
			}
			this.children.forEach((comp) => comp.updatePTMRatio())
		}

		loadFromJson(json: Box2DUnionData) {
			this.oid = json.oid
			this.name = json.name
			json.tags.forEach(tag => this.tags.push(tag))
			this.bodyName = json.bodyName
			this.isSelfDead = false
			this.transform.loadFromJson(json.transform)
			this.skinInfo.loadFromJson(json.skinInfo)
			this.fixedContacts = json.fixedContacts
			this.children = json.children.map((child) => {
				let node = new Box2DNode()
				node.loadFromJson(child)
				return node
			})
			this.team = json.team
			this.totalTeams = json.totalTeams.concat()
		}

		updateParent() {
			if (this.transform) {
				this.transform.parent = this
			}
			if (this.skinInfo) {
				this.skinInfo.parent = this
			}
			for (let child of this.children) {
				child.parent = this
				child.updateParent()
			}
		}

		getBelongedZoneId(body: Box2DBody) {
			let bodyId = body.findRigidBody().oid
			let connect = this.fixedContacts.find(c => c.groupId == bodyId)
			if (connect) {
				return connect.connectZoneId
			} else {
				return bodyId
			}
		}

		getBelongedZone(body: Box2DBody) {
			let bodyId = body.findRigidBody().oid
			let connect = this.fixedContacts.find(c => c.groupId == bodyId)
			let zoneId = bodyId
			if (connect) {
				zoneId = connect.connectZoneId
			}

			// 整合为一个body群
			let molecules: Box2DBody[] = []
			this.children.forEach(childNode => {
				childNode.children.forEach((childBody) => {
					molecules.push(childBody)
				})
			})

			let zone = molecules.find(body => body.findRigidBody().oid == zoneId)
			return zone
		}

		createUnion(world: b2.World): Box2DUnion {

			let outsideFixedContact: OutsideFixedContact = this.outsideFixedContact

			let b2Union = new Box2DUnion()
			b2Union.name = this.name
			b2Union.mid = this.oid
			this.tags.forEach(tag => b2Union.tags.push(tag))
			b2Union.box2dUnionData = this

			// 合并 skillextra 信息
			b2Union.skillExtras.length = 0
			this.children.forEach((childNode) => {
				childNode.skillExtras.forEach((extra) => {
					b2Union.skillExtras.push(extra)
				})
			})

			// 整合为一个body群
			let molecules: Box2DBody[] = []
			this.children.forEach(childNode => {
				childNode.children.forEach((childBody) => {
					molecules.push(childBody)
				})
			})

			// 找到 main body
			let mainNode = this.children.find(child => child.name == this.bodyName)
			if (mainNode == null) {
				mainNode = this.children[0]
			}
			let mainBody = mainNode.children.find(body => body.name == "Main")
			if (mainBody == null) {
				mainBody = mainNode.children[0]
			}
			let mainRigidBody = mainBody.findRigidBody()

			let zoneMap: { [key: string]: string } = {}
			for (let contact of this.fixedContacts) {
				zoneMap[contact.groupId] = contact.connectZoneId
			}
			for (let contact of outsideFixedContact.fixedContacts) {
				zoneMap[contact.groupId] = contact.connectZoneId
			}

			let bodyMaps: { [key: string]: Box2DBody } = {}
			molecules.forEach((molecule) => {
				bodyMaps[molecule.findRigidBody().oid] = molecule
			})
			outsideFixedContact.bodyModels.forEach((molecule) => {
				bodyMaps[molecule.findRigidBody().oid] = molecule
			})

			let zoneMoleculesMap: { [key: string]: Box2DBody[] } = EmptyTable()
			molecules.forEach((molecule) => {
				let targetRigidBody = molecule.findRigidBody()
				let zoneId = zoneMap[targetRigidBody.oid]
				// 如果没有焊死，那么独立成为一个body，(除了主体，通常不会出现)
				if (zoneId == null) {
					zoneId = targetRigidBody.oid
				}
				let ls = zoneMoleculesMap[zoneId] = zoneMoleculesMap[zoneId] || []
				ls.push(molecule)
			})

			let zoneB2BodyMap: { [key: string]: b2.Body } = {}
			outsideFixedContact.bodies.forEach((body, index) => {
				let molecule = outsideFixedContact.bodyModels[index]
				zoneB2BodyMap[molecule.findRigidBody().oid] = body
			})

			// 遍历所有 zone 创建body,并附加 fixture
			for (let zoneId in zoneMoleculesMap) {
				// 区域中需要合并的body
				let zoneMolecules = zoneMoleculesMap[zoneId]

				// 区域的主体body，区域中所有body合并到此body中
				let zonBodyModel = bodyMaps[zoneId]

				let isOutsideFixture = false
				let zoneBody: b2.Body
				if (zoneB2BodyMap[zoneId]) {
					zoneBody = zoneB2BodyMap[zoneId]
					isOutsideFixture = true
				} else {
					let zoneRigidBody = zonBodyModel.components.find(comp => comp instanceof RigidBody) as RigidBody
					let zoneBodyDef = zoneRigidBody.createBodyDef()
					let zoneName = zoneRigidBody.parent.parent.name
					zoneBody = zoneRigidBody.createBody(zoneName, world, zoneBodyDef, b2Union.oid)
					let bodyPos = zonBodyModel.getInUnionPosition2()
					zoneBody.SetPosition(new b2.Vec2(bodyPos.x, bodyPos.y))
					zoneB2BodyMap[zoneId] = zoneBody
					b2Union.bodies.push(zoneBody)
				}

				// 遍历创建fixture
				zoneMolecules.forEach((molecule) => {
					molecule.components.forEach((comp) => {
						if (comp instanceof PhysicsCollider) {
							let shapes = comp.createShapes(zonBodyModel)
							for (let shape of shapes) {
								let fixtureDef = comp.createFixtureDef()
								fixtureDef.shape = shape

								let fixture = comp.createFixture(zoneBody, fixtureDef, b2Union.oid)
								b2Union.fixtures.push(fixture)
								if (isOutsideFixture) {
									b2Union.outsideFixture.push(fixture)
								}

								let fixtureOffset = molecule.calcShapePtInMainBody(zonBodyModel, new Vec2())
								let fixtureAngle = molecule.calcAngleInFixture(zonBodyModel)
								let fixtureFlip = molecule.calcFlipInMainBody(zonBodyModel)
								let fixtureTransform = new Transform()
								fixtureTransform.position = Vec3.fromXYZLike(fixtureOffset)
								fixtureTransform.rotation = fixtureAngle
								fixtureTransform.flip = fixtureFlip as TFlip
								fixture.GetUserData<IBox2DFixtureData>().transform = fixtureTransform

							}
						}
					})
				})
			}

			// 设置整体原点信息
			let headBodyId = zoneMap[mainRigidBody.oid]
			if (headBodyId == null) {
				headBodyId = mainRigidBody.oid
			}
			b2Union.headBody = zoneB2BodyMap[headBodyId]

			// 遍历创建joints
			molecules.forEach((molecule) => {
				let myGroupId = molecule.findRigidBody().oid
				let myZoneId = zoneMap[myGroupId]
				if (myZoneId == null) {
					myZoneId = myGroupId
				}
				let myZoneB2Body = zoneB2BodyMap[myZoneId]

				molecule.components.forEach((comp) => {
					if (comp instanceof Joint) {
						let groupId = comp.connectedBody.oid
						let zoneId = zoneMap[groupId]
						if (zoneId == null) {
							zoneId = groupId
						}
						let b2body = zoneB2BodyMap[zoneId]

						let mainBodyModelA = bodyMaps[myZoneId]
						let bodyModelA = bodyMaps[myGroupId]
						let mainBodyModelB = bodyMaps[zoneId]
						let bodyModelB = bodyMaps[groupId]

						let jointDef = comp.createJointDef(mainBodyModelA, bodyModelA, mainBodyModelB, bodyModelB)
						jointDef.bodyA = myZoneB2Body
						jointDef.bodyB = b2body

						let b2Joint = comp.createJoint(world, jointDef, b2Union.oid)
						b2Union.joints.push(b2Joint)
					}
				})
			})

			b2Union.setPosition(Vector.asVector2(this.transform.position))

			let isOutsideBody = outsideFixedContact.bodies.indexOf(b2Union.headBody) >= 0
			b2Union.isOutsideHeadBody = isOutsideBody
			if (!isOutsideBody) {
				// 不去影响主体的旋转和位置
				b2Union.headBody.SetAngle(this.transform.rotation)
			}

			return b2Union
		}
	}
}
