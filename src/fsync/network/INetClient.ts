namespace fsync {

export interface INetClient {
	init()
	isConnected: boolean
	sendRaw(data: bytes)
	send(reqId: TReqId, data: bytes, call: (info: SessionInfo) => void)
	onerror: (error: Error) => void | null;
	onclose: (reason: Reason) => void | null;
	close()
	connect(url: string): Promise<void>
	listen(reqId: TReqId, call: (info: SessionInfo) => void)
}

}