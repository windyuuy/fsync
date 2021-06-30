
import "../../dist/fsync.js"
import { TestWorld } from "./TestWorld"

test('hello', () => {
	let testWorld = new TestWorld().init()
	testWorld.update()
	testWorld.merge()
	testWorld.clear()
})
