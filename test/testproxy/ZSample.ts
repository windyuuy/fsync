
import ecsproxy = fsync.ecsproxy

// 配表模型
export class RoleConfigModel implements ecsproxy.IConfigBase {
	id = 234
	roleId: string = "324"
}

const roleConfigModels = [new RoleConfigModel()]

export namespace entities {
	@fsync.cid
	@ecsproxy.DecoCompProxy
	export class RoleMark {
	}
	@fsync.cid
	@ecsproxy.DecoCompProxy
	export class DynamicMark {
	}
	@fsync.cid
	@ecsproxy.DecoCompProxy
	export class StaticMark {
	}

	@fsync.cid
	@ecsproxy.DecoCompProxy
	export class RoleStatusComp {
		// 普通数据项
		data1: number = 0
		data2: string = ""
		data3: boolean = false

		// 配表
		roleConfig = ecsproxy.StandCompConfig(RoleConfigModel, roleConfigModels, "defaultId")

		// 引用entity
		wheel = ecsproxy.StandEntityProxy(WheelEntityProxy)

		// 引用entity列表
		wheels = ecsproxy.StandEntityProxyArray(WheelEntityProxy)

		// 引用自定义类型数据
		box2dBody = ecsproxy.StandCustomData(CustomDataA, CustomDataAAccessor, 23)

		// 引用自定义类型数据
		box2dBodys = ecsproxy.StandCustomDataArray(CustomDataA, CustomDataAAccessor)
	}

	export class CustomDataA {
		id = 23
		value = 234
	}

	const CustomDataAAccessor: ecsproxy.ICustomDataAccessor = {
		toTarget: (id: number) => {
			let xx = new CustomDataA();
			xx.id = id;
			return xx;
		},
		toClonable: (data: CustomDataA) => data.id,
	}

	@fsync.cid
	@ecsproxy.DecoEntityProxy
	export class WheelEntityProxy extends ecsproxy.EntityProxyBase {

		roleStatus = ecsproxy.StandCompProxy(RoleStatusComp)

	}

	@fsync.cid
	@ecsproxy.DecoEntityProxy
	export class RoleEntityProxy extends ecsproxy.EntityProxyBase {
		roleStatus = ecsproxy.StandCompProxy(RoleStatusComp)
		roleMark = ecsproxy.StandCompProxy(RoleMark)

		@ecsproxy.DecoDynamicComp
		dynamicMark = ecsproxy.StandCompProxy(DynamicMark)

		staticMark = ecsproxy.StandCompProxy(StaticMark)

		forEachXX(call: Function) {
			call()
		}
	}
}

ecsproxy.proxyClasses.decorateAll()

@fsync.cid
export class TestSystem extends ecsproxy.ProxySystemBase {
	update() {
		this.createQuery(entities.RoleEntityProxy).with(entities.RoleStatusComp).with(entities.RoleMark).forEach((proxy) => {
			proxy.roleStatus.roleConfig = roleConfigModels[0]
			let roleId = proxy.roleStatus.roleConfig.roleId
			proxy.roleStatus.wheel.roleStatus.roleConfig = ecsproxy.ToCompConfig("234")
			let roleId2 = proxy.roleStatus.roleConfig.roleId
			fsync.assert(roleId == roleId2, "set config failed")

			let wheelId = proxy.roleStatus.wheel.roleStatus.roleConfig.roleId
			let wheelIds = proxy.roleStatus.wheels.map(wheel => wheel.roleStatus.roleConfig.roleId)

			let dynamicMark = proxy.dynamicMark
			fsync.assert(!dynamicMark.isNotNull, "should be invalid")
			let staticMark = proxy.staticMark
			fsync.assert(staticMark.isNotNull, "should be valid")

			proxy.roleStatus.wheel = proxy.roleStatus.wheel

			proxy.roleStatus.wheels = proxy.roleStatus.wheels.concat([])

			proxy.forEachXX(() => {
				console.log("klwjefkl")
			})

			let a = proxy.roleStatus.box2dBody
			let b = new entities.CustomDataA()
			b.id = 2355
			b.value = 7656
			proxy.roleStatus.box2dBody = b

			let aas = proxy.roleStatus.box2dBodys
			proxy.roleStatus.box2dBodys = [b]
			let aas2 = proxy.roleStatus.box2dBodys
		})
	}
}
