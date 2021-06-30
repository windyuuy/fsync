namespace fsync {

	export class Updater implements IUpdater {
		updaters: IUpdater[]

		init() {
			this.updaters = []
			return this
		}

		onBeforeUpdate(): void {

		}
		update() {

		}
		onAfterUpdate(): void {

		}
	}

}