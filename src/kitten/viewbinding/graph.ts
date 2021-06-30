
namespace graph {

	export let createSprite: typeof graphengine.createSprite = () => {
		return graphengine.createSprite()
	}

	export type ISprite = graphengine.ISprite

	export type SystemEvent<T = any> = {
		data: T
	}

	export let systemEventCenter
	export const getSystemEvent: () => slib.SEvent<SystemEvent> = () => {
		if (systemEventCenter == null) {
			systemEventCenter = new slib.SEvent<SystemEvent>()
		}
		return systemEventCenter
	}
	export const PredefSystemEvent = {
		GameFinished: "GameFinished",
	}

}

namespace graph {
	window["graph"] = graph
}
