namespace fsync.event {
	export type EventHandler<T> = (message: T) => void
	export class SimpleEvent<T> {
		protected _callbacks: EventHandler<T>[] = []
		on(callback: EventHandler<T>): EventHandler<T> {
			this._callbacks.push(callback)
			return callback
		}

		off(callback: EventHandler<T>) {
			// this._callbacks.remove(callback)
			lang.helper.ArrayHelper.remove(this._callbacks, callback)
		}

		emit(value: T) {
			this._callbacks.concat().forEach((callback) => {
				callback(value)
			})
		}

		clear() {
			this._callbacks.clear()
		}
	}

	export interface ISEventInput<T> {
		emit(key: string, value: T)
	}

	export interface ISEventOutput<T> {
		on(key: string, callback: EventHandler<T>): { key: string, callback: EventHandler<T> }
		once(key: string, callback: EventHandler<T>): { key: string, callback: EventHandler<T> }
		off(key: string, callback: EventHandler<T>)
	}

	export class SEvent<T> implements ISEventInput<T>, ISEventOutput<T>{
		protected _events: { [key: string]: SimpleEvent<T> } = Object.create(null)

		on(key: string, callback: EventHandler<T>): { key: string, callback: EventHandler<T> } {
			if (!this._events[key]) {
				this._events[key] = new SimpleEvent<T>()
			}
			const event = this._events[key]
			if (event) {
				event.on(callback)
			}
			return { key, callback }
		}

		once(key: string, callback: EventHandler<T>): { key: string, callback: EventHandler<T> } {
			const call: EventHandler<T> = (evt) => {
				this.off(key, call)
				callback(evt)
			}
			this.on(key, call)
			return { key, callback: call }
		}

		off(key: string, callback: EventHandler<T>) {
			if (callback == undefined) {
				delete this._events[key]
			} else {
				const event = this._events[key]
				if (event) {
					event.off(callback)
				}
			}
		}

		emit(key: string, value: T) {
			if (this._events[key]) {
				const event = this._events[key]
				if (event) {
					event.emit(value)
				}
			}
		}

		clear() {
			for (let key in this._events) {
				let event = this._events[key]
				if (event) {
					event.clear()
				}
			}
			this._events = Object.create(null)
		}
	}
}
