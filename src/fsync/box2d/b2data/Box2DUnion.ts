
namespace fsync.box2d.b2data {
	export interface WithUserData {
		GetUserData(): IBox2DUserData
	}

	export class Box2DUnion implements IBox2DModel {
		name: string
		/**
		 * 标签列表，可调试用
		 */
		tags: string[] = []
		oid: string
		mid: string
		bodies: b2.Body[] = []
		joints: b2.Joint[] = []
		fixtures: b2.Fixture[] = []
		outsideFixture: b2.Fixture[] = []
		headBody: b2.Body
		isOutsideHeadBody: bool = false
		skillExtras: ISkillExtra[] = []
		modelToTargetMap: { [key: string]: string }

		box2dUnionData: Box2DUnionData

		updateUserData(uidTool: UniqueIDTool) {
			this.oid = uidTool.genTypedId("Box2DUnion")
			for (let body of this.bodies) {
				let userData = body.GetUserData() as IBox2DBodyData
				userData.oid = uidTool.genTypedId("b2body")
				userData.unionId = this.oid
			}
			for (let fixture of this.fixtures) {
				let userData = fixture.GetUserData() as IBox2DFixtureData
				userData.oid = uidTool.genTypedId("b2fixture")
				userData.unionId = this.oid
			}
			for (let joint of this.joints) {
				let userData = joint.GetUserData() as IBox2DJointData
				userData.oid = uidTool.genTypedId("b2joint")
				userData.unionId = this.oid
			}

			let compsMap: { [key: string]: string } = {}
			let comps: WithUserData[] = [].concat(this.bodies).concat(this.joints).concat(this.fixtures)
			comps.forEach((comp) => {
				let mid = comp.GetUserData().mid
				compsMap[mid] = comp.GetUserData().oid
			})

			this.modelToTargetMap = compsMap

			// let skillExtras = this.skillExtras
			// let skillExtrasConvert: ISkillExtra[] = []
			// for (let skillExtra of skillExtras) {
			// 	let newExtra = EmptyTable()
			// 	for (let key in skillExtra) {
			// 		let value = skillExtra[key]
			// 		let mapValue = compsMap[value]
			// 		if (mapValue != null) {
			// 			newExtra[key] = mapValue
			// 		} else {
			// 			newExtra[key] = value
			// 		}
			// 	}
			// 	skillExtrasConvert.push(newExtra)
			// }
			// this.skillExtras = skillExtrasConvert

		}

		getFixturesByModelId(id: string): b2.Fixture[] {
			let fs = this.fixtures.filter(fixture => (fixture as WithUserData).GetUserData().mid == id)
			return fs
		}

		getFixturesByBodyModel(bodyModel: Box2DBody) {
			let comps = bodyModel.components.filter(comp => comp instanceof b2data.PhysicsCollider)
			let fixtures: b2.Fixture[] = []
			comps.forEach(comp => {
				let fs = this.getFixturesByModelId(comp.oid)
				fs.forEach(fixture => {
					fixtures.push(fixture)
				})
			})
			return fixtures
		}

		getFixturesByNodeModel(nodeModel: Box2DNode) {
			let fixtuers: b2.Fixture[] = []
			nodeModel.children.forEach(bodyModel => {
				this.getFixturesByBodyModel(bodyModel).forEach(fixture => {
					fixtuers.push(fixture)
				})
			})
			return fixtuers
		}

		calcAABB() {
			let minX = Number.MAX_VALUE
			let maxX = -Number.MAX_VALUE
			let minY = Number.MAX_VALUE
			let maxY = -Number.MAX_VALUE

			let vs = new b2.AABB()
			vs.lowerBound.x = Number.MAX_VALUE
			vs.lowerBound.y = Number.MAX_VALUE
			vs.upperBound.x = -Number.MAX_VALUE
			vs.upperBound.y = -Number.MAX_VALUE

			let bodyExist = false

			for (let body of this.bodies) {
				box2DHelper.getBodyAABB(body, vs)
				bodyExist = true
			}

			if (!bodyExist) {
				throw new Error("invalid body for calc AABB")
			}

			minX = vs.lowerBound.x
			minY = vs.lowerBound.y
			maxX = vs.upperBound.x
			maxY = vs.upperBound.y

			return {
				x: (minX + (maxX - minX) / 2),
				y: (minY + (maxY - minY) / 2),
				width: Math.abs(maxX - minX),
				height: Math.abs(maxY - minY),
			}
		}

		setPosition(pos: b2data.Vec2) {
			let b2Pos = new b2.Vec2(pos.x, pos.y)
			let headPos = this.headBody.GetPosition()
			let offset = b2Pos.Clone().SelfSub(headPos)
			this.bodies.forEach(body => {
				body.SetPosition(body.GetPosition().SelfAdd(offset))
			})
		}

	}

}
