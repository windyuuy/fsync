

namespace fsync.box2d.b2data {

	let objIdMap: { [key: string]: string } = {}
	let oidAcc = 1
	const genOid = () => {
		return oidAcc++
	}

	export function toExpression(varname: string | number | boolean) {
		if (typeof (varname) == "string") {
			return `"${varname}"`
		} else {
			return varname
		}
	}

	export function exportValueToTypescript(sentences: string[], depth: number, parentName: string, varname: string | number, node: string | number | boolean) {
		let tab = '\t'.repeat(depth)
		sentences.push(`${tab}${parentName}[${toExpression(varname)}] = ${toExpression(node)};`)
	}

	export function exportArrayToTypescript(sentences: string[], depth: number, parentName: string, varname: string | number, node: Object) {
		let typeName = node.constructor.name
		let varLocalKey = `var_${varname}`
		let tab = '\t'.repeat(depth)
		sentences.push(`${tab}const ${varLocalKey}: any[] = [];\n`)
		sentences.push(`${tab}${parentName}[${toExpression(varname)}] = ${varLocalKey};`)
		sentences.push(`${tab}{\n`)

		for (let key of Object.getOwnPropertyNames(node)) {
			let value = node[key]
			if (typeof (value) == "object") {
				if (value instanceof Array) {
					exportObjectToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
				} else {
					exportObjectToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
				}
			} else {
				exportValueToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
			}
		}

		sentences.push(`${tab}}\n`)
	}

	export function exportObjectToTypescript(sentences: string[], depth: number, parentName: string, varname: string | number, node: Object) {
		let typeName = node.constructor.name
		if (b2data[typeName]) {
			typeName = `b2data.${typeName}`
		} else if (fsync[typeName]) {
			typeName = `fsync.${typeName}`
		}
		let tab = '\t'.repeat(depth)

		let varLocalKey = `var_${varname}`

		let oid = node["oid"]

		if (oid && objIdMap[oid]) {
			let gName = objIdMap[oid]
			sentences.push(`${tab}${parentName}[${toExpression(varname)}] = ${gName};`)
		} else {
			sentences.push(`${tab}const ${varLocalKey}: ${typeName} = new ${typeName}();`)

			if (oid) {
				let gid = genOid()
				let gName = `gvar_${gid}`
				objIdMap[oid] = gName
				sentences.push(`${tab}var ${gName} = ${varLocalKey};`)
			}

			sentences.push(`${tab}${parentName}[${toExpression(varname)}] = ${varLocalKey};`)
			sentences.push(`${tab}{\n`)

			for (let key of Object.getOwnPropertyNames(node)) {
				let value = node[key]
				if (typeof (value) == "object") {
					if (value instanceof Array) {
						exportArrayToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
					} else {
						exportObjectToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
					}
				} else {
					exportValueToTypescript(sentences, depth + 1, `${varLocalKey}`, key, value)
				}
			}

			sentences.push(`${tab}}\n`)
		}

	}

	export function exportB2NodeToTypescript(b2Node: Box2DNode) {

		oidAcc = 1
		objIdMap = {}

		let sentences: string[] = []
		sentences.push(`namespace b2stuffs {`)
		sentences.push(`\texport const get${b2Node.name}Data = () => {`)
		sentences.push(`\t\tconst b2Root = {};`)
		b2data.exportObjectToTypescript(sentences, 2, "b2Root", "b2Var", b2Node)
		sentences.push(`\t\tconst result${b2Node.name} = b2Root["b2Var"];`)
		sentences.push(`\t\treturn result${b2Node.name};`)
		sentences.push(`\t}`)
		sentences.push(`}`)
		return sentences
	}

}
