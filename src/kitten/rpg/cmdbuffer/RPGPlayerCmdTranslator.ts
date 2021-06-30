
namespace kitten.rpg {
	const uidTool = new fsync.UniqueIDTool().init()

	/**
	 * 将玩家操作转译成统一指令
	 */
	export class RPGPlayerCmdTranslator implements ICmdTranslator {
		init() {
			return this
		}

		protected curGameCmd: RPGPlayerCmd

		protected roleData: RPGRoleDataBase
		setRoleData(roleData: RPGRoleDataBase) {
			this.roleData = roleData
		}

		protected curCmdIndex = 1
		protected initGameCtrl() {
			let cmd = this.curGameCmd
			if (cmd == null) {
				const now = Date.now()
				cmd = {
					cmdIndex: -1,
					needSync: true,
					route: "local",
					cmdType: "RoleCmd",
					cmdId: null,
					roleId: this.roleData.roleId,
					createTime: now,
					skills: [],
				}
				this.curGameCmd = cmd
			}
		}

		protected getGameCmd() {
			this.initGameCtrl()
			let cmd = this.curGameCmd
			return cmd
		}

		protected gamepad: kitten.gamepad.NormalGamepad
		setGameInput(gamepad: kitten.gamepad.NormalGamepad) {
			this.gamepad = gamepad
		}

		/**
		 * 简单的转义出：df []
		 * - 左按下->平移{方向，正在移动}
		 * - 右按下->技能方向{技能索引，方向，正在释放}
		 */
		protected translate(gamepad: kitten.gamepad.NormalGamepad) {
			if (gamepad == null) {
				return
			}

			gamepad.updateVirtualCtrls()

			if (gamepad.leftStickStatus.pressed) {
				let cmd = this.getGameCmd()
				cmd.move = {
					actorId: undefined,
					times: 1,
					dir: gamepad.leftStickStatus.dir.getBinData(),
				}
			} else {
				let cmd = this.getGameCmd()
				cmd.move = null
			}

			this.getGameCmd().skills.length = 0
			let skillSticks = gamepad.virutalCtrls.slice(1)
			for (let i = 0; i < skillSticks.length; i++) {
				let status = skillSticks[i].ctrlStatus
				if (status.touchAction != "loosed") {
					let cmd = this.getGameCmd()
					cmd.skills.push({
						skillIndex: i,
						actorId: undefined,
						skillName: undefined,
						skillId: undefined,
						targets: [],
						touchAction: status.touchAction,
						dir: status.dir.getBinData(),
					})
				}
			}

			{
				let cmd = this.curGameCmd
				if (
					cmd.skills.length == 0
					&& cmd.move == null
				) {
					this.curGameCmd = null
				}
			}
		}

		clearCurGameCmd(): void {
			this.curGameCmd = null
		}

		protected cmdCopy = fsync.EmptyTable()
		getCurGameCmd(): kitten.rpg.IGameInputCmd {
			this.translate(this.gamepad)
			let cmd = fsync.ObjectUtils.copyDataDeep({} as kitten.rpg.IGameInputCmd, this.curGameCmd)
			if (cmd != null) {
				cmd.cmdId = uidTool.genTypedId("icmd_" + this.roleData.roleId)
				cmd.cmdIndex = this.curCmdIndex++
			}
			return cmd
		}

		/**
		 * 创建一个空指令, 提示一帧结束
		 */
		getNopCmd() {
			let cmd: RPGPlayerCmd = {
				/**
				 * 命令类型
				 */
				cmdType: "RoleCmd",
				cmdId: uidTool.genTypedId("icmd_" + this.roleData.roleId),
				/**
				 * 创建顺序，保证命令执行顺序
				 */
				cmdIndex: this.curCmdIndex++,
				/**
				 * 该命令是否需要触发同步
				 * - 默认false
				 */
				needSync: true,
				// 来源
				route: "local",
				// 输入端id，通常可使用roleId代替
				roleId: this.roleData.roleId,
				// 创建时间（发送时间）
				createTime: Date.now(),
				skills: [],
			}
			return cmd
		}
	}
}
