

namespace fsync.box2d.b2data {

	const createContactListener = () => {
		class ContactListener extends b2.ContactListener {

			mm = {}
			/**
			* Called when two fixtures begin to touch.
			* 当两个fixture碰撞时，触发该函数
			* @param contact Contact point.
			**/
			BeginContact(contact: b2.Contact): void {
				{
					let a = contact.GetFixtureA().GetUserData() as IBox2DFixtureData
					let b = contact.GetFixtureB().GetUserData() as IBox2DFixtureData

					let fixtureA = contact.GetFixtureA()
					let fixtureB = contact.GetFixtureB()

					this.mm[fixtureA.GetUserData<any>().oid] = true
					this.mm[fixtureB.GetUserData<any>().oid] = true
					// console.log("Collision-begin", this.mm)

					a.contacts = a.contacts.filter(c => c.contact.GetFixtureA() != fixtureB && c.contact.GetFixtureB() != fixtureB)
					b.contacts = b.contacts.filter(c => c.contact.GetFixtureA() != fixtureA && c.contact.GetFixtureB() != fixtureA)

					let state: "begin" | "on" | "end" = "begin";

					if (a) {
						a.contacts.push({ state, contact });
					}
					if (b) {
						b.contacts.push({ state, contact });
					}
				}
			}

			/**
			* Called when two fixtures cease to touch.
			* 当两个fixture停止碰撞时，触发该函数
			* @param contact Contact point.
			**/
			EndContact(contact: b2.Contact): void {
				let a = contact.GetFixtureA().GetUserData() as IBox2DFixtureData
				let b = contact.GetFixtureB().GetUserData() as IBox2DFixtureData

				let fixtureA = contact.GetFixtureA()
				let fixtureB = contact.GetFixtureB()

				this.mm[fixtureA.GetUserData<any>().oid] = false
				this.mm[fixtureB.GetUserData<any>().oid] = false
				// console.log("Collision-end", this.mm)


				a.contacts = a.contacts.filter(c => c.contact.GetFixtureA() != fixtureB && c.contact.GetFixtureB() != fixtureB)
				b.contacts = b.contacts.filter(c => c.contact.GetFixtureA() != fixtureA && c.contact.GetFixtureB() != fixtureA)

				let state: "begin" | "on" | "end" = "end";

				if (a) {
					a.contacts.push({ state, contact });
				}
				if (b) {
					b.contacts.push({ state, contact });
				}

			}


			/**
			* This lets you inspect a contact after the solver is finished. This is useful for inspecting impulses. Note: the contact manifold does not include time of impact impulses, which can be arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly in a separate data structure. Note: this is only called for contacts that are touching, solid, and awake.
			* 在碰撞检测之后，但在碰撞求解（物理模拟）之前，此函数的事件会被触发。这样是为了给开发者一个机会，根据当前情况来决定是否使这个接触失效。在回调的函数中使用一个设置函数就可以实现单侧碰撞的功能。每次碰撞处理时，接触会重新生效，开发者不得不在每一个时间步中都设置同一个接触无效。由于连续碰撞检测，PreSolve事件在单个时间步中有可能发生多次
			* @param contact Contact point.
			* @param impulse Contact impulse.
			**/
			PreSolve(contact: b2.Contact, oldManifold: b2.Manifold): void {

			}

			/**
			* This is called after a contact is updated. This allows you to inspect a contact before it goes to the solver. If you are careful, you can modify the contact manifold (e.g. disable contact). A copy of the old manifold is provided so that you can detect changes. Note: this is called only for awake bodies. Note: this is called even when the number of contact points is zero. Note: this is not called for sensors. Note: if you set the number of contact points to zero, you will not get an EndContact callback. However, you may get a BeginContact callback the next step.
			* 当引擎完成了碰撞求解，也就是物理模拟过程过后，开发者可以得到碰撞冲量（collision impulse）的结果时，函数postSolve就会被调用了。这将是提供给开发者附加碰撞结果的机会。
			* 在一个接触回调函数PostSolve中去改变物理世界的模拟数据，是一件神奇的工作。例如，在游戏中可能会以碰撞的方式来消灭敌人。此时开发者就可以在此函数中施加伤害，并试图摧毁关联的角色和它的刚体。然而，引擎并不允许开发者在回调函数中改变物理世界的物体，这样做是为了避免摧毁引擎正在运算的对象，造成访问错误。
			* @param contact Contact point.
			* @param oldManifold Old manifold.
			**/
			PostSolve(contact: b2.Contact, impulse: b2.ContactImpulse): void {

			}

			BeginContactFixtureParticle(system: b2.ParticleSystem, contact: b2.ParticleBodyContact): void {

			}
			EndContactFixtureParticle(system: b2.ParticleSystem, contact: b2.ParticleBodyContact): void {

			}
			BeginContactParticleParticle(system: b2.ParticleSystem, contact: b2.ParticleContact): void {

			}
			EndContactParticleParticle(system: b2.ParticleSystem, contact: b2.ParticleContact): void {

			}

		}

		return new ContactListener()
	}

	export class Box2DWorld {
		gravity: Vec2 = new Vec2(0, -10)
		concatListener: b2.ContactListener

		loadFromJson(json: Box2DWorld) {
			this.gravity = Vec2.fromNumArray(json.gravity['data'])
		}

		createWorld() {
			this.concatListener = createContactListener()

			let world: b2.World = new b2.World(new b2.Vec2(this.gravity.x, this.gravity.y), true);
			world.SetContactListener(this.concatListener)
			return world
		}
	}

}
