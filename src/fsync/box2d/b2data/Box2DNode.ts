
namespace fsync.box2d.b2data {

	/**
	 * 节点皮肤信息
	 */
	export class NodeSkinInfo {
		skinId: number = -1

		parent: Box2DNode

		loadFromJson(json: NodeSkinInfo) {
			this.skinId = json.skinId
		}

		getSkinId() {
			if (this.skinId >= 0) {
				return this.skinId
			}
			if (this.parent != null) {
				return this.parent.parent.skinInfo.getSkinId()
			}
			return -1
		}

		setSkinId(skinId: number) {
			this.skinId = skinId
		}

	}

	/**
	 * 对应box预制体根节点
	 */
	export class Box2DNode implements IBox2DModel, Box2DParent {
		oid: string
		name: string
		children: Box2DBody[] = []
		transform: Transform
		parent: Box2DUnionData

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

		/**
		 * 图层顺序
		 */
		layerOrder: number = 0

		/**
		 * 皮肤信息
		 */
		skinInfo: NodeSkinInfo = new NodeSkinInfo()

		getPTMRatio() {
			if (this.parent) {
				return this.PTM_RATIO * this.parent.getPTMRatio()
			}
			return this.PTM_RATIO
		}

		updatePTMRatio() {
			this.transform.updatePTMRatio()
			this.children.forEach((comp) => comp.updatePTMRatio())
		}

		/**
		 * 所挂技能附件的信息
		 */
		skillExtras: ISkillExtra[] = []

		updateParent() {
			this.transform.parent = this
			this.skinInfo.parent = this
			for (let child of this.children) {
				child.parent = this
				child.updateParent()
			}
		}

		loadFromJson(json: Box2DNode) {
			this.oid = json.oid
			this.name = json.name

			this.isSelfDead = false

			this.layerOrder = json.layerOrder

			this.skinInfo.loadFromJson(json.skinInfo)

			this.transform = new Transform()
			this.transform.loadFromJson(json.transform)

			this.children = []
			for (let child of json.children) {
				let childCopy = new Box2DBody()
				childCopy.loadFromJson(child)
				this.children.push(childCopy)
			}

			this.skillExtras = json.skillExtras
		}
	}


}
