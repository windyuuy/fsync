namespace fsync {

export interface IOverwritable{
	rewrite(d: IOverwritable): bool
}

}