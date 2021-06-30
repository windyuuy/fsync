
namespace kitten.rpg {
	export interface ICmdTranslator {
		init(): ICmdTranslator
		setRoleData(roleData: RPGRoleDataBase)
		setGameInput(gamepad: kitten.gamepad.NormalGamepad)
		clearCurGameCmd(): void
		getCurGameCmd(): kitten.rpg.IGameInputCmd
		getNopCmd(): kitten.rpg.IGameInputCmd
	}
}
