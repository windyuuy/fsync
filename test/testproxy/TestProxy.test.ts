
import { TestWorld } from "./TestWorld"

test('hello', () => {
	let testWorld = new TestWorld().init()
	testWorld.update()
})
