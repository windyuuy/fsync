
namespace kitten.rpg {
	export class RPGRoleDataBase {
		userId: kitten.TUserId = 0
		roleId: kitten.TRoleId = ""
		roomId?: kitten.TRoomId = 0
		level: number = 0
		battleCount: number = 0
		score: number = 0
		winRate: number = 0
	}
}
