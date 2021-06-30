namespace fsync {
	// import { WebSocketClient } from "./WebSocketClient";

	export class ClientFactory {
		static createClient(proto: "websocket"): INetClient {
			let client: INetClient
			if (document == null) {
				// client = new WebSocketClient()
			} else {
				client = new BWebSocketClient()
			}

			client.init()
			return client
		}
	}

}