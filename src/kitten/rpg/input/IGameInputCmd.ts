
namespace kitten.rpg {

	export type InputCmdId = string

	export type IGameInputCmd = {
		/**
		 * 命令类型
		 */
		cmdType: "RoleCmd" | "Pass"
		cmdId: InputCmdId
		/**
		 * 创建顺序，保证命令执行顺序
		 */
		cmdIndex: number
		/**
		 * 该命令是否需要触发同步
		 * - 默认false
		 */
		needSync?: bool
		// 来源
		route: "net" | "local"
		// 输入端id，通常可使用roleId代替
		roleId: TRoleId
		// 创建时间（发送时间）
		createTime: number
		/**
		 * 生成类型：
		 *  con：连续
		 *  sep：离散
		 */
		genType?: "con" | "sep"
		// updateCount?: number
		// lastCmdId?: InputCmdId
		// 创建时世界帧率
		createFrameCount?: number
		frameCount?: number
		// 备份用
		netFrameCount?: number
		/**
		 * 是处理过粘帧
		 */
		isAdjustedForSurge?: boolean
		// 接收时间
		receivedTime?: number

		/**
		 * 网络波动造成命令帧重叠
		 */
		isSurge?: bool
	}

}