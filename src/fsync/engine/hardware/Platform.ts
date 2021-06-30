namespace fsync {

	export class Platform {
		isBrowser: boolean = false

		init() {
			this.isBrowser = (document != null)
			return this
		}
	}

	export const platform = new Platform().init()

}