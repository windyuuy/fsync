namespace fsync {

	export interface IView<T = any> {
		getRaw?<W = T>(): W
		init(): IView<T>
		setPos(pos: Vector3): void;
		setScale(pos: Vector3): void;
		setRotation(quat: Vector4): void;
		destroy(): void
	}

}