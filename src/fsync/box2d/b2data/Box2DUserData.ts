
namespace fsync.box2d.b2data {
	export interface IB2ContactState {
		/**
		 * 碰撞状态
		 * - begin 已发生碰撞时
		 * - on 进行中
		 * - end 碰撞结束时
		 */
		state: "begin" | "on" | "end",
		contact: b2.Contact,
	}

	export interface IBox2DUserData {
		/**
		 * 标记
		 */
		name: string
		/**
		 * 自身唯一id
		 */
		oid: string
		/**
		 * 对应模型节点的 oid
		 */
		mid: string
		/**
		 * 归属的unionId
		 */
		unionId: string
		entityId?: string
	}

	export interface IBox2DFixtureData extends IBox2DUserData {
		displayKey?: string
		/**
		 * 产生的碰撞信息
		 */
		contacts: IB2ContactState[]
		/**
		 * fixture相对body的坐标
		 */
		transform?: Transform
	}

	export interface IBox2DBodyData extends IBox2DUserData {
		/**
		 * 产生的碰撞信息
		 */
		contacts: IB2ContactState[]
	}

	export interface IBox2DJointData extends IBox2DUserData {

	}

}
