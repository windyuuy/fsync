
namespace fsync.box2d.b2data {
	export class CollisionGroup {
		enabled: boolean = false
		groupIndex: string = ""
		categoryBits: string = ""
		maskBits: string = ""

		team: number = 0
		totalTeams: number[] = []

		/**
		 * 启用自动双向碰撞
		 */
		enableDuplex: bool = true
		/**
		 * 检查单双向碰撞 maskbits 差异
		 */
		checkDuplexDifference: bool = false

		setTeamInfo(team: number, totalTeams: number[]) {
			this.team = team
			this.totalTeams = totalTeams
		}

		loadFromJson(json: CollisionGroup) {
			this.enabled = json.enabled
			this.groupIndex = json.groupIndex
			this.categoryBits = json.categoryBits
			this.maskBits = json.maskBits
		}

		static groupIndexMap: { [key: string]: number } = {}
		static groupIndexAcc: number = 1

		static categoryMap: { [key: string]: number } = {}
		static categoryExpAcc: number = 1
		static categoryExpMax = 16

		static maskBitsMap: { [key: string]: number } = {}

		updateCollisionGroup() {
			let groupIndex = CollisionGroup.groupIndexMap[this.groupIndex]
			if (groupIndex == null) {
				if (!!this.groupIndex) {
					groupIndex = CollisionGroup.groupIndexMap[this.groupIndex] = CollisionGroup.groupIndexAcc++
				}
			}

			this.updateCategorys(this.categoryBits)
			this.updateCategorys(this.maskBits)

			this.updateMaskBitsMap(this.maskBits)
		}

		protected updateMaskBitsMap(maskBits: string) {
			let key = `${this.getCategoryBits()}`
			let maskBitsNum = CollisionGroup.maskBitsMap[key]
			if (maskBitsNum == undefined) {
				maskBitsNum = 0
			}

			let categorys = maskBits.split(";")
			categorys.forEach((category) => {
				this.expandCategoryTeams(category, (category) => {
					let categoryExpNum = CollisionGroup.categoryMap[category]
					let categoryNum = 2 ** categoryExpNum
					maskBitsNum = maskBitsNum | categoryNum
				})
			})

			CollisionGroup.maskBitsMap[key] = maskBitsNum
		}

		protected updateCategorys(categoryBits: string) {
			let categorys = categoryBits.split(";")
			categorys.forEach((category) => {
				this.expandCategoryTeams(category, (category) => {
					let categoryExpNum = CollisionGroup.categoryMap[category]
					if (categoryExpNum == null) {
						if (!!category) {
							let n = CollisionGroup.categoryExpAcc++
							categoryExpNum = CollisionGroup.categoryMap[category] = n
						}
					}
				})
			})
		}

		protected expandCategoryTeams(category: string, call: (c: string) => void) {
			if (category.startsWith("$")) {
				// 	$开头，则替换为组序号
				let teamCategory = category.replace("$", `T${this.team}_`)
				call(teamCategory)
			} else if (category.startsWith("~")) {
				// 	~开头，则替换为其他组序号
				this.totalTeams.forEach((team) => {
					if (team != this.team) {
						let deCategory = category.replace("~", `T${team}_`)
						call(deCategory)
					}
				})
			} else if (category.startsWith("#")) {
				// 	#开头，则替换为所有组序号
				this.totalTeams.forEach((team) => {
					let deCategory = category.replace("#", `T${team}_`)
					call(deCategory)
				})
			} else {
				call(category)
			}
		}

		protected mapCategorys(categoryBits: string) {
			let categorys = categoryBits.split(";")
			let categorysNum = 0
			categorys.forEach((category) => {
				this.expandCategoryTeams(category, (category) => {
					let categoryExpNum = CollisionGroup.categoryMap[category]
					categorysNum = categorysNum | 2 ** categoryExpNum
				})
			})
			return categorysNum
		}

		getGroupIndex() {
			if (!!this.groupIndex) {
				return CollisionGroup.groupIndexMap[this.groupIndex]
			}
			return 0
		}

		/**
		* 表示刚体的分组信息，但不决定要碰撞的分组对象。另外，值得注意的，这个值必须是2的N次方。当然设置成其他值，程序不会报错，但是实际的碰撞分类效果，可能会出现意想不到的差错。
		*/
		getCategoryBits(): number {
			return this.mapCategorys(this.categoryBits)
		}

		/**
		* 表示刚体要碰撞的那个刚体分组对象。这个值通常是另外一个FilterData对象的categoryBits属性，表示只与该类刚体发生碰撞。如果要对多组刚体进行碰撞，可以设置maskBits为多个categoryBits的加合。如要和categoryBits分别为2和4的刚体组都进行碰撞，可以设置maskBits属性为6。
		*/
		getMaskBits(): number {
			if (this.enableDuplex) {
				let key = `${this.getCategoryBits()}`
				let bits = CollisionGroup.maskBitsMap[key]

				if (this.checkDuplexDifference) {
					let bits1 = this.mapCategorys(this.maskBits)
					if (bits1 != bits) {
						console.warn("unmatched mask bits", this)
					}
				}

				return bits
			} else {
				let bits1 = this.mapCategorys(this.maskBits)
				return bits1
			}
		}

	}
}
