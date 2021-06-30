

namespace fsync.box2d {
	export class Box2DHelper {
		getBodyAABB(b: b2.Body, vs: b2.AABB) {
			for (let fx = b.GetFixtureList(); fx; fx = fx.GetNext()) {
				for (let pi = 0; pi < fx.m_proxies.length; pi++) {
					let proxy = fx.m_proxies[pi]
					let ab = proxy.aabb
					if (proxy.treeNode) {
						ab = proxy.treeNode.aabb
					}
					vs.lowerBound.x = Math.min(vs.lowerBound.x, ab.lowerBound.x)
					vs.lowerBound.y = Math.min(vs.lowerBound.y, ab.lowerBound.y)
					vs.upperBound.x = Math.max(vs.upperBound.x, ab.upperBound.x)
					vs.upperBound.y = Math.max(vs.upperBound.y, ab.upperBound.y)
				}
			}

			return vs
		}
	}
	export const box2DHelper = new Box2DHelper()
}
