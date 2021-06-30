
import "../../dist/fsync"
import EntityProxyBase = fsync.ecsproxy.EntityProxyBase;
import proxyClasses = fsync.ecsproxy.proxyClasses;
import assert = fsync.assert;
import entityProxyHelper = fsync.ecsproxy.entityProxyHelper;
import { entities, TestSystem } from "./ZSample"

export class TestWorld {
	world: fsync.ECSWorld
	updater: fsync.UpdaterGroup
	buffSystem: fsync.SystemBase

	init() {

		proxyClasses.decorateAll()

		let utils = new fsync.FrameSyncUtils().init()
		let world = new fsync.ECSWorld().init(utils)
		this.world = world

		let updater = new fsync.UpdaterGroup()
		updater.init()
		this.updater = updater

		let testSystem = new TestSystem().init()
		testSystem.world = world
		updater.addUpdater(testSystem)

		this.createTestEntity()

		return this
	}

	createTestEntity() {
		let entityManager = this.world.entityManager
		let wheelEntity = entityProxyHelper.createEntityProxy(entityManager, entities.WheelEntityProxy)
		let roleEntity = entityProxyHelper.createEntityProxy(entityManager, entities.RoleEntityProxy)

		roleEntity.roleStatus.wheel = wheelEntity
		roleEntity.roleStatus.wheels = [wheelEntity]
		let wheels = roleEntity.roleStatus.wheels
		let wheel = roleEntity.roleStatus.wheel
	}

	update() {
		let updater = this.updater
		updater.onBeforeUpdate()
		updater.update()
		updater.onAfterUpdate()
	}
}
