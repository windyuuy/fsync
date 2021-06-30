namespace fsync {

	export interface IUpdater {
		onBeforeUpdate(): void
		update(): void
		onAfterUpdate(): void

		onset?(): void
		clear?(): void
	}

}