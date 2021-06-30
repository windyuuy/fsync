namespace fsync {

	export interface IMerge<T> {
		mergeFrom(target: T)
	}
}
