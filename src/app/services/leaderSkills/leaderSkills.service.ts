import { Injectable } from '@angular/core';
import { Attribute, Attributes, Type, Types } from '../../interfaces/card.interfaces';

@Injectable({ providedIn: 'root' })
export class LeaderSkillService {
	private _skillMap = [];
	private skillData;
	private skill;
	private skillName;
	private skillDescription;

	registerDataSource(skillData) {
		this.skillData = JSON.parse(JSON.stringify(skillData));
	}

	createNewSkill(name, description) {
		this.skill = [name, description, 138, 0, 0, ''];
		this.skillName = name;
		this.skillDescription = description;
	}

	getModifiedDataSource() {
		return this.skillData;
	}

	finalizeChanges() {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = this.skill;
		return skillIndex;
	}

	isExecutable(fn) {
		return typeof this[fn] === 'function';
	}

	processLeaderSkill(skills: any[]) {
		let result = [];

		skills.forEach((skill) => {
			try {
				result.push(skill);
			} catch (error) {
				console.log(error);
			}
		});

		return result;
	}

	setName(name: string) {
		this.skillName = name;
		return this;
	}

	setDescription(description: string) {
		this.skillDescription = description;
		return this;
	}

	resetNameAndDescription() {
		this.setName('');
		this.setDescription('');
	}

	convertAttributeArrayToBinary(attributes: Attributes | Attribute) {
		if (typeof attributes === 'string') attributes = [attributes];
		return attributes.reduce((previous, current, index) => {
			let map = {
				bomb: '1000000000',
				mortalPoison: '0100000000',
				poison: '0010000000',
				jammer: '0001000000',
				heart: '0000100000',
				dark: '0000010000',
				light: '0000001000',
				wood: '0000000100',
				water: '0000000010',
				fire: '0000000001',
			};
			if (['mortal', 'm'].includes(current)) current = 'mortalPoison';
			if (['p'].includes(current)) current = 'poison';
			if (['j'].includes(current)) current = 'jammer';
			if (['h', 'heal'].includes(current)) current = 'heart';
			if (['d', 'purple'].includes(current)) current = 'dark';
			if (['l', 'yellow'].includes(current)) current = 'light';
			if (['g', 'green'].includes(current)) current = 'wood';
			if (['b', 'blue'].includes(current)) current = 'water';
			if (['r', 'red'].includes(current)) current = 'fire';
			return !map[current] ? previous : previous + parseInt(map[current], 2);
		}, 0);
	}

	convertTypeArrayToBinary(types: Types) {
		if (typeof types === 'string') types = [types];
		return types.reduce((previous, current, index) => {
			let map = {
				redeemable: '100000000000000',
				enhance: '010000000000000',
				awaken: '000100000000000',
				machine: '000000100000000',
				devil: '000000010000000',
				attacker: '000000001000000',
				god: '000000000100000',
				dragon: '000000000010000',
				healer: '000000000001000',
				physical: '000000000000100',
				balanced: '000000000000010',
				evo: '000000000000001',
			};
			return !map[current] ? previous : previous + parseInt(map[current], 2);
		}, 0);
	}

	convertAttributeToInteger(attribute: Attribute) {
		let map = {
			r: 0,
			red: 0,
			fire: 0,
			b: 1,
			blue: 1,
			water: 1,
			g: 2,
			green: 2,
			wood: 2,
			l: 3,
			light: 3,
			yellow: 3,
			d: 4,
			dark: 4,
			purple: 4,
			h: 5,
			heart: 5,
			heal: 5,
			j: 6,
			jammer: 6,
			p: 7,
			poison: 7,
			m: 8,
			mortal: 8,
			mortalPoison: 8,
			bomb: 9,
		};
		return map[attribute] || 0;
	}

	voidPoison() {
		this.resetNameAndDescription();
		this.skill.push(15607);
		return 15607;
	}

	taikoDrum() {
		this.resetNameAndDescription();
		this.skill.push(294);
		return 294;
	}

	extendTime(numberOfSeconds: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 15, 0, 0, '', numberOfSeconds * 100];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForAttributesAndTypesPlusShield(
		boostingAttributes: Attributes,
		boostingTypes: Types,
		HPMultiplier: number,
		ATKMultiplier: number,
		RCVMultiplier: number,
		attributesForShield: Attribute | Attributes = '',
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;

		if (shield === 0 || !shield || !attributesForShield) {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				129,
				0,
				0,
				'',
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				HPMultiplier * 100,
				ATKMultiplier * 100,
				RCVMultiplier * 100,
			];
		} else {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				129,
				0,
				0,
				'',
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				HPMultiplier * 100,
				ATKMultiplier * 100,
				RCVMultiplier * 100,
				this.convertAttributeArrayToBinary(attributesForShield as Attributes),
				shield,
			];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForAttributesAndTypesPlusTimeExtend(
		boostingAttributes: Attributes,
		boostingTypes: Types,
		HPMultiplier: number,
		ATKMultiplier: number,
		RCVMultiplier: number,
		timeExtend: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			185,
			0,
			0,
			'',
			timeExtend * 100,
			this.convertAttributeArrayToBinary(boostingAttributes),
			this.convertTypeArrayToBinary(boostingTypes),
			HPMultiplier * 100,
			ATKMultiplier * 100,
			RCVMultiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForAttributesMatchPlusShield(
		attributesRequired: Attributes,
		numberOfAttributeMatchesRequired: number,
		ATKMultiplier: number,
		shield: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			170,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributesRequired),
			numberOfAttributeMatchesRequired,
			ATKMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForSkillUsage(attributes: Attributes, types: Types, ATKMultiplier: number, RCVMultiplier: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			133,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			this.convertTypeArrayToBinary(types),
			ATKMultiplier * 100,
			RCVMultiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsPlusNoSkyfallPlusShield(
		boostingAttributes: Attributes,
		boostingTypes: Types,
		HPMultiplier: number,
		ATKMultiplier: number,
		RCVMultiplier: number,
		attributesForShield: Attribute | Attributes = '',
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;

		if (boostingAttributes.length === 0 && boostingTypes.length === 0) {
			this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 163, 0, 0, ''];
		}

		if (shield === 0 || !shield || !attributesForShield) {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				163,
				0,
				0,
				'',
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				HPMultiplier * 100,
				ATKMultiplier * 100,
				RCVMultiplier * 100,
			];
		} else {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				163,
				0,
				0,
				'',
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				HPMultiplier * 100,
				ATKMultiplier * 100,
				RCVMultiplier * 100,
				this.convertAttributeArrayToBinary(attributesForShield as Attributes),
				shield,
			];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	noSkyfall() {
		this.resetNameAndDescription();
		return this.boostStatsPlusNoSkyfallPlusShield([], [], 1, 1, 1, '');
	}

	bonusComboForBlobMatch(
		attributes: Attributes,
		minMatchRequired: number,
		ATKMultiplier: number,
		bonusCombo: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			192,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minMatchRequired,
			ATKMultiplier * 100,
			bonusCombo,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	bonusComboPlusBoostAttackForAttributesMatch(
		attributes: Attributes,
		minMatchRequired: number,
		ATKMultiplier: number,
		bonusCombo: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			194,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minMatchRequired,
			ATKMultiplier * 100,
			bonusCombo,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	bonusComboForColorCombosMatch(
		attribute1: Attribute,
		attribute2: Attribute,
		attribute3: Attribute,
		minMatchRequired: number,
		bonusCombo: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			206,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attribute1),
			this.convertAttributeArrayToBinary(attribute2),
			this.convertAttributeArrayToBinary(attribute3),
			0,
			0,
			minMatchRequired,
			bonusCombo,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	bonusDamageForBlobMatch(attributes: Attributes, minMatchRequired: number, bonusDamage: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			200,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minMatchRequired,
			bonusDamage,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	bonusDamageForAttributesMatch(attributes: Attributes, minMatchRequired: number, bonusDamage: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			199,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minMatchRequired,
			bonusDamage,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	bonusDamageForColorCombosMatch(
		attribute1: Attribute,
		attribute2: Attribute,
		attribute3: Attribute,
		attribute4: Attribute,
		minMatchRequired: number,
		bonusDamage: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			201,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attribute1),
			this.convertAttributeArrayToBinary(attribute2),
			this.convertAttributeArrayToBinary(attribute3),
			this.convertAttributeArrayToBinary(attribute4),
			minMatchRequired,
			bonusDamage,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	shieldForLowHPWithChance(thresholdInInteger: number, shield: number, chance: number = 100) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			38,
			0,
			0,
			'',
			thresholdInInteger,
			chance,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}
	shieldForHighHPWithChance(thresholdInInteger: number, shield: number, chance: number = 100) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			43,
			0,
			0,
			'',
			thresholdInInteger,
			chance,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForLowHPWithShield(
		thresholdInInteger: number,
		boostingAttributes: Attributes,
		boostingTypes: Types,
		ATKMultiplier: number,
		RCVMultiplier: number,
		attributesForShield: boolean | Attributes = false,
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;

		if (shield === 0 || !shield || !attributesForShield) {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				130,
				0,
				0,
				'',
				thresholdInInteger,
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				ATKMultiplier * 100,
				RCVMultiplier * 100,
			];
		} else {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				130,
				0,
				0,
				'',
				thresholdInInteger,
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				ATKMultiplier * 100,
				RCVMultiplier * 100,
				this.convertAttributeArrayToBinary(attributesForShield as Attributes),
				shield,
			];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForHighHPWithShield(
		thresholdInInteger: number,
		boostingAttributes: Attributes,
		boostingTypes: Types,
		ATKMultiplier: number,
		RCVMultiplier: number,
		attributesForShield: boolean | Attributes = false,
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;

		if (shield === 0 || !shield || !attributesForShield) {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				131,
				0,
				0,
				'',
				thresholdInInteger,
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				ATKMultiplier * 100,
				RCVMultiplier * 100,
			];
		} else {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				131,
				0,
				0,
				'',
				thresholdInInteger,
				this.convertAttributeArrayToBinary(boostingAttributes),
				this.convertTypeArrayToBinary(boostingTypes),
				ATKMultiplier * 100,
				RCVMultiplier * 100,
				this.convertAttributeArrayToBinary(attributesForShield as Attributes),
				shield,
			];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	sevenBySix() {
		this.resetNameAndDescription();
		this.skill.push(13505);
		return 13505;
	}

	boostATKForBlobMatchWithScaling(
		attributes: Attributes,
		minConnectedOrbCount: number,
		minATKMultiplier: number,
		attackStep: number,
		maxConnectedOrbCount: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			159,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minConnectedOrbCount,
			minATKMultiplier * 100,
			attackStep * 100,
			maxConnectedOrbCount,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForAttributesMatchWithScaling(
		attributes: Attributes,
		minAttributesRequired: number,
		minATKMultiplier: number,
		attackStep: number,
		maxAttributesRequired: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			61,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minAttributesRequired,
			minATKMultiplier * 100,
			attackStep * 100,
			maxAttributesRequired,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForColorComboMatchWithScaling(
		attribute1: Attribute,
		attribute2: Attribute,
		attribute3: Attribute,
		attribute4: Attribute,
		attribute5: Attribute,
		minMatchRequired: number,
		minATKMultiplier: number,
		attackStep: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			124,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attribute1),
			this.convertAttributeArrayToBinary(attribute2),
			this.convertAttributeArrayToBinary(attribute3),
			this.convertAttributeArrayToBinary(attribute4),
			this.convertAttributeArrayToBinary(attribute5),
			minMatchRequired,
			minATKMultiplier * 100,
			attackStep * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForComboMatchWithScaling(
		minComboCount: number,
		minATKMultiplier: number,
		attackStep: number,
		maxComboCount: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			98,
			0,
			0,
			'',
			minComboCount,
			minATKMultiplier * 100,
			attackStep * 100,
			maxComboCount,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsPlusCannotMatchLessThan(
		minMatch: number,
		attributes: Attributes,
		types: Types,
		HPMultiplier: number,
		ATKMultiplier: number,
		RCVMultiplier: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			158,
			0,
			0,
			'',
			minMatch,
			this.convertAttributeArrayToBinary(attributes),
			this.convertTypeArrayToBinary(types),
			ATKMultiplier * 100,
			HPMultiplier * 100,
			RCVMultiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKWithExactCombos(comboCount: number, ATKMultiplier: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			101,
			0,
			0,
			'',
			comboCount,
			ATKMultiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKPlusUnbindPlusShieldWhenRecoverHP(
		healAmountRequired: number,
		ATKMultiplier: number = 1,
		shield: number = 0,
		unboundTurns: number = 0
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			198,
			0,
			0,
			'',
			healAmountRequired,
			ATKMultiplier * 100,
			shield,
			unboundTurns,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForComboPlusShield(comboRequired: number, ATKMultiplier: number = 1, shield: number = 0) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			169,
			0,
			0,
			'',
			comboRequired,
			ATKMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForBlobMatchPlusShield(
		attributes: Attributes,
		minMatchRequired: number,
		ATKMultiplier: number,
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			182,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			minMatchRequired,
			ATKMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForHeartCrossMatchWithShield(ATKMultiplier: number, RCVMultiplier: number = 1, shield: number = 0) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			151,
			0,
			0,
			'',
			ATKMultiplier * 100,
			RCVMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKForAttributeCrossMatch(attributeAndMultiplierJSONPairs: { [attribute in Attribute]: number }) {
		/**
		 * attributeAndMultiplierPairs such as { fire: 1.5, dark: 1.5}
		 * Maximum of 4
		 */
		let skillIndex = this.skillData.skill.length;

		if (Object.keys(attributeAndMultiplierJSONPairs).length > 4) {
			console.log('boostATKForAttributeCrossMatch can only take up to 4 non-heart attribute at a time');
		}

		let data = [];
		for (let attribute in attributeAndMultiplierJSONPairs) {
			data.push(this.convertAttributeToInteger(attribute as Attribute));
			data.push(attributeAndMultiplierJSONPairs[attribute] * 100);
		}
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 157, 0, 0, '', ...data];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKFor5O1E(ATKMultiplier: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			150,
			0,
			0,
			'',
			0,
			ATKMultiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	resolve(threshold: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 14, 0, 0, '', threshold, 100];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	counterAttack(chance: number, counterMultiplier: number, attribute: Attribute) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			41,
			0,
			0,
			'',
			chance,
			counterMultiplier * 100,
			this.convertAttributeToInteger(attribute),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);

		return skillIndex;
	}

	bonusComboForAttributeCross(attributes: Attributes, comboCount: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			210,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			0,
			comboCount,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);

		return skillIndex;
	}

	boostAttackAndShieldForColorCombosMatch(
		attribute1: Attribute,
		attribute2: Attribute,
		attribute3: Attribute,
		attribute4: Attribute,
		minMatchRequired: number,
		ATKMultiplier: number = 1,
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			171,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attribute1),
			this.convertAttributeArrayToBinary(attribute2),
			this.convertAttributeArrayToBinary(attribute3),
			this.convertAttributeArrayToBinary(attribute4),
			minMatchRequired,
			ATKMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostATKAndRCVAndShieldWithLShape(
		attributes: Attributes,
		ATKMultiplier: number,
		RCVMultiplier: number = 1,
		shield: number = 0
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			193,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			ATKMultiplier * 100,
			RCVMultiplier * 100,
			shield,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boostStatsForAttributesAndTypesPlusFixedOrbMoveTime(
		time: number,
		boostingAttributes: Attributes,
		boostingTypes: Types,
		HPMultiplier: number = 1,
		ATKMultiplier: number = 1,
		RCVMultiplier: number = 1
	) {
		let skillIndex = this.skillData.skill.length;

		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			178,
			0,
			0,
			'',
			time,
			this.convertAttributeArrayToBinary(boostingAttributes),
			this.convertTypeArrayToBinary(boostingTypes),
			HPMultiplier * 100,
			ATKMultiplier * 100,
			RCVMultiplier * 100,
		];

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	healWhenMatchingOrbs(RCVMultiplier: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 13, 0, 0, '', RCVMultiplier * 100];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);

		return skillIndex;
	}

	getSkillMap() {
		this._skillMap.push({
			exec: 'voidPoison',
			description: 'Void Poison damage',
			params: [],
		});

		this._skillMap.push({
			exec: 'taikoDrum',
			description: 'Taiko drums orb sound',
			params: [],
		});

		this._skillMap.push({
			exec: 'extendTime',
			description: 'Extend Orb move time',
			params: [['Number of Seconds', 'number', 5]],
		});

		this._skillMap.push({
			exec: 'boostStatsForAttributesAndTypesPlusShield',
			description: 'Boost stats for attributes and types plus shield',
			params: [
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['HP Multiplier', 'number', 1.5],
				['ATK Multiplier', 'number', 1.5],
				['RCV Multiplier', 'number', 1.5],
				['Gain Damage Reduction Against Attribute', 'attributes', {}],
				['shield', 'number', 0],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForAttributesAndTypesPlusTimeExtend',
			description: 'Boost stats and extend time to move orbs for attributes and types',
			params: [
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['HP Multiplier', 'number', 1.5],
				['ATK Multiplier', 'number', 1.5],
				['RCV Multiplier', 'number', 1.5],
				['Time Extend (Second)', 'number', 5],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForAttributesMatchPlusShield',
			description: 'Boost ATK and shields for matching attributes',
			params: [
				['Attributes Required', 'attributes', {}],
				['Number of Attributes Required', 'number', 2],
				['Attack Multiplier', 'number', 2],
				['Shield', 'number', 25],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForSkillUsage',
			description: 'Boost ATK and RCV on skill usage',
			params: [
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['Attack Multiplier', 'number', 2],
				['RCVMultiplier', 'number', 2],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsPlusNoSkyfallPlusShield',
			description: 'Boost stats and give shield but no skyfall',
			params: [
				['Boosted Attributes', 'attributes', {}],
				['Boosted Types', 'types', {}],
				['HP Multiplier', 'number', 1.5],
				['Attack Multiplier', 'number', 1.5],
				['RCV Multiplier', 'number', 1.5],
				['Attributes Required For Shield', 'attributes', {}],
				['Shield', 'number', 25],
			],
		});

		this._skillMap.push({
			exec: 'noSkyfall',
			description: 'No Skyfall',
			params: [],
		});

		this._skillMap.push({
			exec: 'bonusComboForBlobMatch',
			description: 'Bonus combo for matching connected orbs (blob)',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Connected Orbs Required', 'number', 4],
				['Attack Multiplier', 'number', 2],
				['Bonus Combo', 'number', 1],
			],
		});

		this._skillMap.push({
			exec: 'bonusComboPlusBoostAttackForAttributesMatch',
			description: 'Bonus combo and boost ATK for matching attributes',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Colors Required', 'number', 2],
				['Attack Multiplier', 'number', 2],
				['Bonus Combo', 'number', 1],
			],
		});

		this._skillMap.push({
			exec: 'bonusComboForColorCombosMatch',
			description: 'Bonus combo for matching color combos (combos of the same color)',
			params: [
				['Attribute #1', 'attribute', 'fire'],
				['Attribute #2', 'attributeWithNone', 'fire'],
				['Attribute #3', 'attributeWithNone', 'none'],
				['Minimum Combos of the Same Color required', 'number', 2],
				['Bonus Combo', 'number', 1],
			],
		});

		this._skillMap.push({
			exec: 'bonusDamageForBlobMatch',
			description: 'Bonus damage for matching connected orbs (blob)',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Connected Orbs Required', 'number', 4],
				['Bonus Damage', 'number', 1],
			],
		});

		this._skillMap.push({
			exec: 'bonusDamageForAttributesMatch',
			description: 'Bonus damage for matching attributes',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Colors Required', 'number', 2],
				['Bonus Damage', 'number', 1000000],
			],
		});

		this._skillMap.push({
			exec: 'bonusDamageForColorCombosMatch',
			description: 'Bonus damage for matching color combos (combos of the same color)',
			params: [
				['Attribute #1', 'attribute', 'fire'],
				['Attribute #2', 'attributeWithNone', 'fire'],
				['Attribute #3', 'attributeWithNone', 'none'],
				['Attribute #4', 'attributeWithNone', 'none'],
				['Minimum Combos of the Same Color required', 'number', 2],
				['Bonus Damage', 'number', 1000000],
			],
		});

		this._skillMap.push({
			exec: 'shieldForLowHPWithChance',
			description: 'Damage Reduction (Shield) when HP is low',
			params: [
				['HP Threshold Percent', 'number', 50],
				['Shield Percent', 'number', 50],
				['Chance Percent', 'number', 100],
			],
		});

		this._skillMap.push({
			exec: 'shieldForHighHPWithChance',
			description: 'Damage Reduction (Shield) when HP is high',
			params: [
				['HP Threshold Percent', 'number', 50],
				['Shield Percent', 'number', 50],
				['Chance Percent', 'number', 100],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForLowHPWithShield',
			description: 'Boost stats and shield when HP is low',
			params: [
				['HP Threshold Percent', 'number', 50],
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['ATK Multiplier', 'number', 2],
				['RCV Multiplier', 'number', 2],
				['Gain Damage Reduction Against Attributes', 'attributes', {}],
				['Shield Percent', 'number', 50],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForHighHPWithShield',
			description: 'Boost stats and shield when HP is high',
			params: [
				['HP Threshold Percent', 'number', 50],
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['ATK Multiplier', 'number', 2],
				['RCV Multiplier', 'number', 2],
				['Gain Damage Reduction Against Attributes', 'attributes', {}],
				['Shield Percent', 'number', 50],
			],
		});

		this._skillMap.push({
			exec: 'sevenBySix',
			description: '7x6',
			params: [],
		});

		this._skillMap.push({
			exec: 'boostATKForBlobMatchWithScaling',
			description: 'Boost ATK for matching connected orbs (blob) with scaling',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Number of Connected Orbs', 'number', 4],
				['Minimum ATK Multiplier', 'number', 4],
				['ATK Multiplier Increment for Every Extra Connected Orb', 'number', 1],
				['Maximum Number of Connected Orbs for Multiplier', 'number', 10],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForAttributesMatchWithScaling',
			description: 'Boost ATK for matching attributes with scaling',
			params: [
				['Attributes', 'attributes', {}],
				['Minimum Number of Attributes Required', 'number', 2],
				['Minimum ATK Multiplier', 'number', 4],
				['ATK Multiplier Increment for Every Extra Connected Orb', 'number', 2],
				['Maximum Number of Attributes for Multiplier', 'number', 5],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForColorComboMatchWithScaling',
			description: 'Boost ATK for matching color combos (combos of the same color) with scaling',
			params: [
				['Attribute #1', 'attribute', 'fire'],
				['Attribute #2', 'attributeWithNone', 'fire'],
				['Attribute #3', 'attributeWithNone', 'none'],
				['Attribute #4', 'attributeWithNone', 'none'],
				['Attribute #5', 'attributeWithNone', 'none'],
				['Minimum Combos of the Same Color required', 'number', 2],
				['Minimum ATK Multiplier', 'number', 4],
				['ATK Multiplier Increment for Every Extra Combo', 'number', 2],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForComboMatchWithScaling',
			description: 'Boost ATK for matching combos with scaling (LEAVE THIS SKILL PART AT THE END)',
			params: [
				['Minimum Combos Required', 'number', 8],
				['Minimum Attack Multiplier', 'number', 8],
				['ATK Multiplier Increment for Every Extra Combo', 'number', 1],
				['Maximum Number of Combos for Multiplier', 'number', 20],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsPlusCannotMatchLessThan',
			description: 'Cannot match less than X number of Orbs but boost stats',
			params: [
				['Minimum Number of Orbs to Be Erasable', 'number', 4],
				['Attributes for Stat Boost', 'attributes', {}],
				['Types for Stat Boost', 'types', {}],
				['HP Multiplier', 'number', 2],
				['ATK Multiplier', 'number', 2],
				['RCV Multiplier', 'number', 2],
			],
		});

		this._skillMap.push({
			exec: 'boostATKWithExactCombos',
			description: 'Boost ATK when reaching the exact number of combos',
			params: [
				['Number of Combos', 'number', 6],
				['ATK Multiplier', 'number', 66],
			],
		});

		this._skillMap.push({
			exec: 'boostATKPlusUnbindPlusShieldWhenRecoverHP',
			description: 'Boost ATK, shield, and awoken unbind when recovers HP with heart Orbs',
			params: [
				['HP Recovery Amount Required', 'number', 50000],
				['ATK Multiplier', 'number', 2],
				['Shield Percent', 'number', 25],
				['Awoken Unbind Turns', 'number', 5],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForComboPlusShield',
			description: 'Boost ATK and shield when reaching a number of combos',
			params: [
				['Number of Combos Required', 'number', 10],
				['ATK Multiplier', 'number', 10],
				['Shield Percent', 'number', 50],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForBlobMatchPlusShield',
			description: 'Boost ATK and shield when matching connected Orbs (blob)',
			params: [
				['Attributes', 'attributes', {}],
				['Number of Connected Orbs Required', 'number', 4],
				['ATK Multiplier', 'number', 8],
				['Shield Percent', 'number', 50],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForHeartCrossMatchWithShield',
			description: 'Boost stats and shield when matching heart cross',
			params: [
				['ATK Multiplier', 'number', 18],
				['RCV Multiplier', 'number', 2],
				['Shield Percent', 'number', 60],
			],
		});

		this._skillMap.push({
			exec: 'boostATKForAttributeCrossMatch',
			description: 'Boost ATK for each cross of certain attributes (excluding heart)',
			params: [
				['Attribute #1', 'attribute', 'fire'],
				['ATK Multiplier for Attribute #1', 'number', 2.5],
				['Attribute #2', 'attribute', 'fire'],
				['ATK Multiplier for Attribute #2', 'number', 2.5],
				['Attribute #3', 'attribute', 'fire'],
				['ATK Multiplier for Attribute #3', 'number', 2.5],
			],
		});

		this._skillMap.push({
			exec: 'boostATKFor5O1E',
			description: 'Boost ATK when matching 5 Orbs including at least 1 Enhanced Orbs',
			params: [['ATK Multiplier', 'number', 12]],
		});

		this._skillMap.push({
			exec: 'resolve',
			description: 'Survive a single hit when HP is above a certain threshold',
			params: [['Minimum HP Threshold', 'number', 25]],
		});

		this._skillMap.push({
			exec: 'counterAttack',
			description: 'Counter attack x amount of damage received with chance',
			params: [
				['Chance for Counter Attack', 'number', 100],
				['Counter Attack Multiplier', 'number', 100],
				['Counter Attack Damage Attribute', 'attribute', 'dark'],
			],
		});

		this._skillMap.push({
			exec: 'bonusComboForAttributeCross',
			description: 'Bonus combos for each cross of selected attributes',
			params: [
				['Attributes', 'attributes', {}],
				['Number of Combos', 'number', 1],
			],
		});

		this._skillMap.push({
			exec: 'boostAttackAndShieldForColorCombosMatch',
			description: 'Boost ATK and shield for matching color combos (combos of the same color)',
			params: [
				['Attribute #1', 'attribute', 'fire'],
				['Attribute #2', 'attributeWithNone', 'fire'],
				['Attribute #3', 'attributeWithNone', 'none'],
				['Attribute #4', 'attributeWithNone', 'none'],
				['Minimum Combos of the Same Color required', 'number', 2],
				['ATK Multiplier', 'number', 18],
				['Shield', 'number', 25],
			],
		});

		this._skillMap.push({
			exec: 'boostATKAndRCVAndShieldWithLShape',
			description: 'Boost ATK, RCV and shield with an L shape of selected attributes',
			params: [
				['Attributes', 'attributes', {}],
				['ATK Multiplier', 'number', 12],
				['RCV Multiplier', 'number', 2],
				['Shield', 'number', 50],
			],
		});

		this._skillMap.push({
			exec: 'boostStatsForAttributesAndTypesPlusFixedOrbMoveTime',
			description: 'Boost stats for attributes and types with fixed Orb move time',
			params: [
				['Time to move Orbs', 'number', 10],
				['Attributes', 'attributes', {}],
				['Types', 'types', {}],
				['HP Multiplier', 'number', 1.5],
				['ATK Multiplier', 'number', 1.5],
				['RCV Multiplier', 'number', 1.5],
			],
		});

		this._skillMap.push({
			exec: 'healWhenMatchingOrbs',
			description: 'Recover HP after matching Orbs',
			params: [['RCV multiplier (x times the RCV)', 'number', 100]],
		});

		return this._skillMap;
	}
}
