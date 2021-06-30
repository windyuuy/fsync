
namespace kitten.gamepad {
	/**
	 * 摇杆共享状态
	 */
	export class StickSharedState {
		multiTouchMap: { [id: string]: string } = fsync.EmptyTable()
	}
}
