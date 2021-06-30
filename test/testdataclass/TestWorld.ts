
import { ReferData, ReferData2, ReferData3, ReferData4, ReferData5, TestData, TestSystem, TestSystem2 } from "./TestSystem"

export class TestWorld {
	clear() {
		this.mainWorld.clear()
		this.predictWorld.clear()
	}
	mainWorld: fsync.ECSWorld
	predictWorld: fsync.ECSWorld
	mainUpdater: fsync.UpdaterGroup
	predictUpdater: fsync.UpdaterGroup

	mergeSystem: fsync.eds.ECSDataMergeSystem
	testSystem2: fsync.SystemBase

	merge() {
		this.mergeSystem.onBeforeUpdate()
		this.mergeSystem.update()
		this.mergeSystem.onAfterUpdate()

		this.testSystem2.update()
	}

	init() {
		{
			let utils = new fsync.FrameSyncUtils().init()
			let world = new fsync.ECSWorld().init(utils)
			this.mainWorld = world

			let updater = new fsync.UpdaterGroup()
			updater.init()
			this.mainUpdater = updater

			this.createTestEntity(this.mainWorld)

			let testSystem = new TestSystem().init()
			testSystem.world = world
			updater.addUpdater(testSystem)

		}
		{
			let utils = new fsync.FrameSyncUtils().init()
			let world = new fsync.ECSWorld().init(utils)
			this.predictWorld = world

			let updater = new fsync.UpdaterGroup()
			updater.init()
			this.predictUpdater = updater

			this.createTestEntity(this.predictWorld)

			let testSystem = new TestSystem2().init()
			testSystem.world = world
			this.testSystem2 = testSystem
			// updater.addUpdater(testSystem)

			let mergeSystem = new fsync.eds.ECSDataForceMergeSystem().init()
			mergeSystem.source = this.mainWorld
			mergeSystem.target = this.predictWorld
			this.mergeSystem = mergeSystem

		}

		return this
	}

	createTestEntity(world: fsync.ECSWorld) {
		let dataManager = world.dataManager

		let testData = dataManager.addData(TestData)
		let referData = dataManager.addData(ReferData)
		let referData2 = dataManager.addData(ReferData2)
		let referData3 = dataManager.addData(ReferData3)
		let referData4 = dataManager.addData(ReferData4)
		let referData5 = dataManager.addData(ReferData5)

		testData.ref = referData
		testData.ref2 = referData2

	}

	update() {
		{
			let updater = this.mainUpdater
			updater.onBeforeUpdate()
			updater.update()
			updater.onAfterUpdate()
		}
		{
			let updater = this.predictUpdater
			updater.onBeforeUpdate()
			updater.update()
			updater.onAfterUpdate()
		}
	}
}
