
namespace kitten.rpg {
	/**
	 * 缓存指定角色行为的命令
	 */
	export class SingleActorCmdBuffer<T extends IActorCmd = IActorCmd> {
		protected cmds: T[]

		init() {
			this.cmds = []
			return this
		}

		putCmd(cmd: T) {
			this.cmds.push(cmd)
		}

		popCmd(): T {
			return this.cmds.shift()
		}

		getLatestCmd(): T {
			return this.cmds[this.cmds.length - 1]
		}
	}

	/**
	 * 管理所有角色命令缓冲
	 */
	export class ActorCmdBuffer<T extends IActorCmd = IActorCmd>{
		cmdBuffers: { [key: string]: SingleActorCmdBuffer<T> }

		init() {
			this.cmdBuffers = {}
			return this
		}

		addCmdBuffer(actorId: TActorId) {
			let cmdBuffer = this.getCmdBuffer(actorId)
			if (cmdBuffer == null) {
				cmdBuffer = this.cmdBuffers[actorId] = new SingleActorCmdBuffer<T>().init()
			}
			return cmdBuffer
		}

		putCmd(cmd: T) {
			this.addCmdBuffer(cmd.actorId).putCmd(cmd)
		}

		getCmdBuffer(actorId: TActorId) {
			return this.cmdBuffers[actorId]
		}

		getLatestCmd(actorId: TActorId) {
			return this.addCmdBuffer(actorId).getLatestCmd()
		}

		getOrPutLatestCmd(actorId: TActorId) {
			let cmdBuffer = this.addCmdBuffer(actorId)
			let cmd = cmdBuffer.getLatestCmd()
			if (cmd == null) {
				cmd = {
					actorId,
				} as T
				cmdBuffer.putCmd(cmd)
			}
			return cmd
		}

		getActors(): TActorId[] {
			return Object.keys(this.cmdBuffers)
		}

		clear() {
			this.init()
		}
	}
}
