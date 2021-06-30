
namespace fsync.box2d.b2data {
	export interface ISkillExtra {
		oid: string
		noid: string
		skillType: string
		skillName?: string;
	}

	export class SkillExtra implements ISkillExtra {
		oid: string;
		noid: string;
		skillType: string;
		skillName?: string;
	}
}
