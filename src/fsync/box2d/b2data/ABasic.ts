
namespace fsync.box2d.b2data {
	export import Vec2 = fsync.Vector2;
	export import Vec3 = fsync.Vector3;
	export import Vec4 = fsync.Vector4;
	export import Size = fsync.Size2;

	export type TFlip = 1 | -1

	export interface IBox2DModel {
		oid: string
	}

	export class ComponentBase implements IBox2DModel {
		parent: Box2DParent

		loadFromJson(child: ComponentBase) {
			this.oid = child.oid
			this.ctype = child.ctype
		}
		oid: string
		ctype: string

		/**
		 * 缩放倍率
		 */
		PTM_RATIO: number = 1

		getPTMRatio() {
			if (this.parent && this.parent['getPTMRatio']) {
				return this.PTM_RATIO * this.parent['getPTMRatio']()
			}
			return this.PTM_RATIO
		}

		updatePTMRatio() {

		}

		getInUnionRotationZ() {
			let body = this.parent
			let node = body.parent

			let rotationZ = body.transform.rotation + node.transform.rotation
			return rotationZ
		}

		getWorldFlipY() {
			let p1 = this.parent
			let p2 = p1.parent
			let p3 = p2.parent

			let flipY = p1.transform.flip * p2.transform.flip * p3.transform.flip
			return flipY
		}

	}

	export class Component extends ComponentBase {
		parent: Box2DBody
		isSelfDead: bool
		isDead() {
			return this.isSelfDead || this.parent.isDead()
		}

		loadFromJson(child: ComponentBase) {
			super.loadFromJson(child)
			this.isSelfDead = false
		}
	}

}
