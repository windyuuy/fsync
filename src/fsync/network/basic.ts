namespace fsync {

	export type TReqId = int64
	export type TRespId = int64
	export type bytes = Uint8Array
	export type TSessionId = int64

	export class Reason {

	}

	export type SessionInfo = {
		sessionId: TSessionId
		reqId: TReqId
		time: TTimeStamp
		data: bytes
		rawData: ArrayBuffer
	}

	export type ClientReqHandler = (sessionInfo: SessionInfo) => void

	export type HeadInfo = {
		// 头部大小
		headSize: uint32
		// 数据段总大小（不包含头部大小）
		dataSize: uint32
	}

	export type TTCPTransOptions = uint32
	export type TCPReqHead = {
		// 头部大小
		HeadSize: uint32
		// 数据段总大小（不包含头部大小）
		DataSize: uint32
		//一些选项：...|是否压缩
		TransOptions: TTCPTransOptions
	}

	export const TCPReqHeadSize = 12
	export const SessionInfoHeadSize = 16
	export const UintSize = 4

	export import assert_true = lang.testsuite.assert_true;

}