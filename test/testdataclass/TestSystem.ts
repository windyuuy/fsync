
import IDataClass = fsync.eds.IDataClass
import DataClass = fsync.eds.DataClass
import NullData = fsync.eds.NullData
import NewData = fsync.eds.NewData
import IDataFeature = fsync.eds.IDataFeature
import DataFeature = fsync.eds.DataFeature

export class ReferData6 extends DataClass {
	stsr = "ReferData6x"
}
export class ReferData5 extends DataClass {
	stsr = "ReferData5x"

	ref = NewData(ReferData6)
}

export class ReferData4 extends DataClass {
	stsr = "ReferData4x"
}

export class ReferData3 extends DataClass {
	stsr = "ReferData3x"
}

export class ReferData2 extends DataClass {
	stsr = "ReferData2x"
}

export class ReferData implements IDataClass {
	readonly oid?: string;
	/**
	 * 类型名
	 */
	readonly otype?: string;

	stsr = "ReferDatax"
}

export class TestData implements IDataClass {
	readonly oid?: string;
	/**
	 * 类型名
	 */
	readonly otype?: string;

	num: number = 234
	str: string = "hellostr"
	bol: boolean = true
	wef = null

	ref = NullData(ReferData)
	ref2 = NullData(ReferData2)
	ref3 = NewData(ReferData5)
}

const IsTestData: IDataFeature<TestData> = {
	name: "IsTestData",
	filter(data) {
		return data instanceof TestData
	},
}

function assert(cond: boolean) {
	if (!cond) {
		throw new Error("invalid")
	}
}

export class TestSystem extends fsync.SystemBase {
	update() {

		const dataManager = this.dataManager

		dataManager.buildFeatureGroups([IsTestData])
		let testDatas = dataManager.getFeatureGroup(IsTestData)
		testDatas.forEach(data => {
			assert(data.num == 234)
			assert(data.str == "hellostr")
			assert(data.ref.stsr == "ReferDatax")
			assert(data.ref2.stsr == "ReferData2x")

			data.ref.stsr = "AAA"
			data.ref2.stsr = "BBBB"
			assert(data.ref.stsr == "AAA")
			assert(data.ref2.stsr == "BBBB")

			data.ref = data.ref
			let ref3 = dataManager.addData(ReferData)
			data.ref2 = ref3
			assert(data.ref2.stsr == "ReferDatax")

			assert(data.ref3.ref.stsr == "ReferData6x")

			console.log("done")
		})

		dataManager.deattachDatas(ReferData3)

	}
}

export class TestSystem2 extends fsync.SystemBase {
	update() {

		const dataManager = this.dataManager

		dataManager.buildFeatureGroups([IsTestData])
		let testDatas = dataManager.getFeatureGroup(IsTestData)
		testDatas.forEach(data => {
			assert(data.num == 234)
			assert(data.str == "hellostr")
			assert(data.ref.stsr == "AAA")
			assert(data.ref2.stsr == "ReferDatax")

			console.log("done")
		})

		let data3 = dataManager.getTypeFeatureGroup(ReferData3)
		assert(data3.length == 0)

		let data4 = dataManager.getTypeFeatureGroup(ReferData4)
		assert(data4.length == 1)
		assert(data4[0].stsr == "ReferData4x")

	}
}
