
namespace kitten.rpg {
	export type TActorId = string

	export class RPGPlayerCmd implements kitten.rpg.IGameInputCmd {
		netFrameCount?: number;
		isAdjustedForSurge?: boolean;
		cmdType: "RoleCmd" | "Pass";
		cmdId: string;
		needSync?: boolean;
		route: "net" | "local";
		roleId: kitten.TRoleId;
		createTime: number;
		genType?: "con" | "sep";
		createFrameCount?: number;
		frameCount?: number;
		receivedTime?: number;
		isSurge?: boolean;
		cmdIndex: number;
		move?: {
			// 执行者id
			actorId: TActorId
			times: number,
			// 方位
			dir: number[];
		};
		skills?: {
			// 执行者id
			actorId: TActorId
			skillName: string;
			skillId: number;
			/**
			 * 技能在技能列表中索引
			 */
			skillIndex: number;

			touchAction: gamepad.TTouchAction
			targets?: string[];
			// 方位
			dir: number[];
		}[]

	}
}
