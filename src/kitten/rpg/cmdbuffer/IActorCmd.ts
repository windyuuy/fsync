
namespace kitten.rpg {
	/**
	 * 角色行为命令定义
	 */
	export interface IActorCmd {
		// 执行者id
		actorId: TActorId

	}

	export interface IRPGActorCmd extends IActorCmd {
		// 移动
		move?: {
			// 方向
			dir: number[],
		}
		skill?: {
			skillName: string
			skillId?: number
			targets?: TActorId[]
		}
	}
}
