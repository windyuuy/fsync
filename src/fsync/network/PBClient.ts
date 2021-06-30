namespace fsync {

	export class PBClient {
		client: INetClient
		proto: ProtoTool
		init(client: INetClient) {
			this.client = client
			return this
		}

		SendReqPB(reqId: TReqId, message: Object, cls: new () => any, call: (info: SessionInfo) => void = null) {
			let bdata = this.proto.encode(message, cls)
			return this.send(reqId, bdata, call)
		}

		SubEvent(respId: TRespId, call: (result: SessionInfo) => void) {
			this.client.listen(respId, call)
		}

		close() {
			this.client && this.client.close()
		}

		connect(url: string): Promise<void> {
			return this.client.connect(url)
		}
		listen(reqId: TReqId, call: (info: SessionInfo) => void) {
			return this.client.listen(reqId, call)
		}

		sendRaw(data: bytes) {
			return this.client.sendRaw(data)
		}
		send(reqId: TReqId, data: bytes, call: (info: SessionInfo) => void = null) {
			return this.client.send(reqId, data, call)
		}

		set onerror(value: (error: Error) => void | null) {
			this.client.onerror = value
		}
		get onerror(): (error: Error) => void | null {
			return this.client.onerror
		}

		set onclose(value: (reason: Reason) => void | null) {
			this.client.onclose = value
		}
		get onclose(): (reason: Reason) => void | null {
			return this.client.onclose
		}

		get isConnected(): boolean {
			return this.client.isConnected
		}
	}
}