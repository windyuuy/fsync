namespace fsync {

	export class UpdaterGroup implements IUpdater {
		updaters: IUpdater[]

		init() {
			this.updaters = []
			return this
		}

		clear() {
			for (let updater of this.updaters) {
				updater.clear && updater.clear()
			}
		}

		onset() {
			for (let updater of this.updaters) {
				updater.onset && updater.onset()
			}
		}

		addUpdater(update: IUpdater) {
			this.updaters.push(update)
		}

		onBeforeUpdate(): void {
			for (let updater of this.updaters) {
				updater.onBeforeUpdate()
			}
		}
		update(): void {
			for (let updater of this.updaters) {
				updater.update()
			}
		}
		onAfterUpdate(): void {
			for (let updater of this.updaters) {
				updater.onAfterUpdate()
			}
		}

	}

	// 游戏加载完毕之后，内容就不会改变，避免重写
	export class UpdaterGroupManager implements IUpdater {
		updaters: { [key: string]: UpdaterGroup }
		updateOrder: string[]

		init() {
			this.updaters = EmptyTable()
			this.updateOrder = []
			this._disabledGroup = {}
			return this
		}

		onset() {
			this.foreachByOrder((updater) => {
				updater.onset()
			})
		}

		clear() {
			this.foreachByOrder((updater) => {
				updater.clear()
			})
		}

		getUpdaterGroup(groupName: string): UpdaterGroup {
			let group = this.updaters[groupName]
			if (group == null) {
				group = new UpdaterGroup()
				group.init()
				this.updaters[groupName] = group
			}
			return group
		}

		addUpdaterGroup(groupName: string, group: UpdaterGroup): void {
			this.updaters[groupName] = group
		}

		setGroupUpdateOrder(updateOrder: string[]) {
			this.updateOrder.length = 0
			for (let order of updateOrder) {
				this.updateOrder.push(order)
			}
		}

		protected _disabledGroup: { [key: string]: bool }
		disableGroup(key: string) {
			this._disabledGroup[key] = true
		}
		enableGroup(key: string) {
			delete this._disabledGroup[key]
		}
		isGroupEnabled(key: string) {
			return !this._disabledGroup[key]
		}

		protected foreachByOrder(call: (updater: UpdaterGroup) => void) {
			let updatedMap = EmptyTable()

			let updaters = this.updaters
			for (let k of this.updateOrder) {
				if (updaters[k]) {
					updatedMap[k] = true
					if (!this._disabledGroup[k]) {
						call(updaters[k])
					}
				}
			}
			for (let k in this.updaters) {
				if (updatedMap[k] != null) {
					continue
				}
				if (!this._disabledGroup[k]) {
					call(updaters[k])
				}
			}

		}

		onBeforeUpdate(): void {
			this.foreachByOrder((updater) => {
				updater.onBeforeUpdate()
			})
		}
		update(): void {
			this.foreachByOrder((updater) => {
				updater.update()
			})
		}
		onAfterUpdate(): void {
			this.foreachByOrder((updater) => {
				updater.onAfterUpdate()
			})
		}

	}

}