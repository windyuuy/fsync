namespace fsync {

	/**
	 * client base on websocket on browser platform
	 */
	export class BWebSocketClient implements INetClient {
		protected client: WebSocket
		protected sessionId: TSessionId

		onerror: (error: Error) => void | null = null;
		onclose: (reason: Reason) => void | null = null;
		isConnected: boolean = false

		init() {
			this.sessionId = 0
			this.isConnected = false
			this.sessionCallbacks = EmptyTable()
			this.subHandlers = EmptyTable()
			return this
		}

		sendRaw(data: bytes) {
			this.client.send(data)
		}
		send(reqId: TReqId, data: bytes, call: (info: SessionInfo) => void = null) {
			if (this.sessionId == 0) {
				this.sessionId++
			}
			let sessionId = this.sessionId++

			let sessionInfo = [
				// sessionId
				sessionId,
				// reqId
				reqId,
				0,
				0,
			]

			let sessionData = new Uint8Array(Uint32Array.from(sessionInfo).buffer)

			let headInfo = [
				// headSize
				TCPReqHeadSize,
				// dataSize
				SessionInfoHeadSize + data.length,
				// TransOptions
				0,
			]

			let headData = new Uint8Array(Uint32Array.from(headInfo).buffer)
			let sendData = BufferHelper.concatUint8Array([headData, sessionData, data])

			if (!!call) {
				assert_true(!this.sessionCallbacks[sessionId])
				this.sessionCallbacks[sessionId] = call
			}

			try {
				this.sendRaw(sendData)
			} catch (e) {
				delete this.sessionCallbacks[sessionId]
			}
		}

		listen(reqId: TReqId, call: (info: SessionInfo) => void) {
			let handlers = this.subHandlers[reqId]
			if (handlers == null) {
				handlers = []
				this.subHandlers[reqId] = handlers
			}
			handlers.push(call)
		}

		protected sessionCallbacks: { [key: number]: ClientReqHandler }
		protected subHandlers: { [key: number]: ClientReqHandler[] }
		protected onProcessData(data: ArrayBuffer) {
			/**
			 *	type HeadInfo struct {
			 *		// 头部大小
			 *		HeadSize uint32
			 *		// 数据段总大小（不包含头部大小）
			 *		DataSize uint32
			 *		TransOptions TTCPTransOptions(uint32)
			 *	}
			 * 头部 3 个 uint32 大小
			 */
			/**
			*	type SessionInfoHead struct {
			*		SessionId TSessionId
			*		ReqId     TReqId
			*		Time      TTimeStamp
			*	}
			* 	SessionHead 4 个 uint32 大小
			*/
			const sessionData = data.slice(TCPReqHeadSize, TCPReqHeadSize + SessionInfoHeadSize)
			const sessionUint32 = new Uint32Array(sessionData)
			const sessionId = sessionUint32[0]
			const reqId = sessionUint32[1]
			const body = data.slice(TCPReqHeadSize + SessionInfoHeadSize)
			const time = sessionUint32[2] * (3 ** 32) + sessionUint32[3]

			const sessionInfo: SessionInfo = {
				data: new Uint8Array(body),
				reqId: reqId,
				rawData: data,
				sessionId: sessionId,
				time: 0,
			}

			const call = this.sessionCallbacks[sessionId]
			if (!!call) {
				delete this.sessionCallbacks[sessionId]
				call(sessionInfo)
			}
			const handlers = this.subHandlers[reqId]
			if (!!handlers) {
				for (let handler of handlers.concat()) {
					handler(sessionInfo)
				}
			}
		}

		connect(url: string): Promise<void> {
			if (!url.startsWith("ws://")) {
				console.error("add 'ws://' to url please")
			}

			const ret = new RPromise<void>()

			let client = new WebSocket(url)

			client.onerror = (ev: Event) => {
				ret.fail(ev)
			}

			client.close = (code?: number, reason?: string) => {
				this.isConnected = false
				const _ = this.onclose && this.onclose({ code, reason })
			}

			client.onopen = (ev: Event) => {
				client.binaryType = "arraybuffer"

				this.isConnected = true
				client.onerror = (ev: Event) => {
					const _ = this.onerror && this.onerror(new Error("" + ev))
				}

				ret.success(undefined)
			}

			client.onmessage = async (e: MessageEvent) => {
				const data = e.data as ArrayBuffer
				this.onProcessData(data)
			}

			this.client = client

			return ret.promise
		}

		close() {
			if(this.client!=null){
				this.client.close()
			}
		}

	}

}