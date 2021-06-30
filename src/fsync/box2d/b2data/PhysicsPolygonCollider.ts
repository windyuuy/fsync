
namespace fsync.box2d.b2data {

	/** undefined */
	export class PhysicsPolygonCollider extends PhysicsCollider implements Polygon {
		/** !#en Position offset
		!#zh 位置偏移量 */
		offset: Vec2;
		/** !#en Polygon points
		!#zh 多边形顶点数组 */
		points: Vec2[];

		loadFromJson(json: PhysicsPolygonCollider) {
			super.loadFromJson(json)
			this.offset = Vec2.fromNumArray(json.offset['data'])
			this.points = json.points.map(vec => Vec2.fromNumArray(vec['data']))
		}

		updatePTMRatio() {
			let rptm = 1 / this.getPTMRatio()

			Vector.multUpVar(this.offset, rptm)
			this.points.map(pt => Vector.multUpVar(pt, rptm))
		}

		createShapes(mainBody: Box2DBody): b2.PolygonShape[] {

			var shapes: b2.PolygonShape[] = [];

			var points = this.points;

			// check if last point equal to first point
			if (points.length > 0 && Vector.equal(points[0], points[points.length - 1])) {
				points.length -= 1;
			}

			var polys = tools.ConvexPartition(points);

			const offset = this.offset

			for (let i = 0; i < polys.length; i++) {
				var poly = polys[i];

				var shape: b2.PolygonShape = null, vertices = [];
				var firstVertice = null;

				for (var j = 0, l = poly.length; j < l; j++) {
					if (!shape) {
						shape = new b2.PolygonShape();
					}
					var p = poly[j];
					var x = (p.x + offset.x);
					var y = (p.y + offset.y);
					var newP = new b2.Vec2(x, y);

					// //对点进行反转+旋转
					// v.x = flip * v.x;

					// {
					// 	let cosInc = Math.cos(angle)
					// 	let sinInc = Math.sin(angle)
					// 	let x = cosInc * v.x - sinInc * v.y;
					// 	let y = sinInc * v.x + cosInc * v.y;
					// 	v.x = x;
					// 	v.y = y;
					// }
					let v = this.calcShaptPtInMainBody(mainBody, Vec2.fromXYZLike(newP))

					vertices.push(v);

					if (!firstVertice) {
						firstVertice = v;
					}

					if (vertices.length === b2.maxPolygonVertices) {
						shape.Set(vertices, vertices.length);
						shapes.push(shape);

						shape = null;

						if (j < l - 1) {
							vertices = [firstVertice, vertices[vertices.length - 1]];
						}
					}
				}

				if (shape) {
					shape.Set(vertices, vertices.length);
					shapes.push(shape);
				}
			}

			return shapes

		}
	}
}
