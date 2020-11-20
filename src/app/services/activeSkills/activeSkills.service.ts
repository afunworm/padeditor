import { Injectable } from '@angular/core';
import { Attribute, Attributes } from '../../interfaces/card.interfaces';

@Injectable({ providedIn: 'root' })
export class ActiveSkillService {
	private _skillMap = [];
	private skillData;
	private skill;
	private skillName;
	private skillDescription;

	constructor() {}

	registerDataSource(skillData) {
		this.skillData = JSON.parse(JSON.stringify(skillData));
	}

	createNewSkill(name, description, maxCDLevel, turnAtCDLv1) {
		this.skill = [name, description, 116, maxCDLevel, turnAtCDLv1, ''];
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

	processActiveSkills(skills: any[]) {
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

	convertPositionToInteger = (input) => parseInt(input.padStart(6, '0').split('').reverse().join(''), 2);

	transform(into: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 202, 0, 0, '', into];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	increaseSkyfall(attributes: Attributes, percent: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			126,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			numberOfTurns,
			numberOfTurns,
			percent,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	unlockOrbs() {
		this.resetNameAndDescription();
		this.skill.push(15886);
		return 15886;
	}

	addCombos(numberOfCombos: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			160,
			0,
			0,
			'',
			numberOfTurns,
			numberOfCombos,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	increaseRCV(multiplier: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			50,
			0,
			0,
			'',
			numberOfTurns,
			5,
			multiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	increaseAttributeAttack(attribute: Attribute, multiplier: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		let attributeInteger = this.convertAttributeToInteger(attribute);

		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			50,
			0,
			0,
			'',
			numberOfTurns,
			attributeInteger,
			multiplier * 100,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	recoverUnmatchable(numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 196, 0, 0, '', numberOfTurns];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	recoverBindsAndHP(
		bindClearNumberOfTurns: number,
		awokenBindClearNumberOfTurn: number,
		HPRecoveryPercentage: number = 0
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			117,
			0,
			0,
			'',
			bindClearNumberOfTurns,
			0,
			0,
			HPRecoveryPercentage,
			awokenBindClearNumberOfTurn,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	increaseTime = (multiplier: number, isMultiplicative: boolean = true, numberOfTurns: number) => {
		let skillIndex = this.skillData.skill.length;

		if (isMultiplicative) {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				132,
				6,
				10,
				'',
				numberOfTurns,
				0,
				multiplier * 100,
			];
		} else {
			this.skillData.skill[skillIndex] = [
				this.skillName,
				this.skillDescription,
				132,
				6,
				10,
				'',
				numberOfTurns,
				multiplier * 10,
			];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	};

	haste(minimumTurns: number, optionalMaximumTurns: number = 0) {
		let skillIndex = this.skillData.skill.length;
		if (!optionalMaximumTurns) optionalMaximumTurns = minimumTurns;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			146,
			6,
			10,
			'',
			minimumTurns,
			optionalMaximumTurns,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	voidAbsorption(
		voidDamageAbsorption: boolean = true,
		voidAttributeAbsorption: boolean = true,
		numberOfTurns: number
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			173,
			0,
			0,
			'',
			numberOfTurns,
			Number(voidDamageAbsorption),
			0,
			Number(voidAttributeAbsorption),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	voidVoid(numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 191, 0, 0, '', numberOfTurns];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	delay(numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 18, 0, 0, '', numberOfTurns];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	gravity(percent: number, isTrueGravity: boolean = false) {
		let skillIndex = this.skillData.skill.length;

		if (isTrueGravity) {
			this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 161, 0, 0, '', percent];
		} else {
			this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 6, 6, 38, '', percent];
		}

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	enhanceOrbs(attributes: Attributes) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			140,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			6,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	suicide(percentOfHPLoss: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			195,
			0,
			0,
			'',
			100 - percentOfHPLoss,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	createOrbs(numberOfOrbs: number, spawnAttributes: Attributes, excludingAttributes?: Attributes) {
		let skillIndex = this.skillData.skill.length;
		if (!excludingAttributes) excludingAttributes = spawnAttributes;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			141,
			0,
			0,
			'',
			numberOfOrbs,
			this.convertAttributeArrayToBinary(spawnAttributes),
			this.convertAttributeArrayToBinary(excludingAttributes),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	shield(percent: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			3,
			6,
			10,
			'',
			numberOfTurns,
			percent,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	createSpinners(speedInSecond: number, numberOfSpinners: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			207,
			0,
			0,
			'',
			numberOfTurns,
			speedInSecond * 100,
			0,
			0,
			0,
			0,
			0,
			numberOfSpinners,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	refreshBoard() {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 10, 0, 0, ''];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	noSkyfall(numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 184, 0, 0, '', numberOfTurns];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	changeEnemyAttribute(attribute: Attribute) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			153,
			6,
			10,
			'',
			this.convertAttributeToInteger(attribute),
			1,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	poisonEnemies(multiplier: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 4, 0, 0, '', multiplier * 100];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	enhanceSkyfallOrbs(percent: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			180,
			6,
			10,
			'',
			numberOfTurns,
			percent,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	lockOrbs(attributes: Attributes, numberOfOrbs: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			152,
			0,
			0,
			'',
			this.convertAttributeArrayToBinary(attributes),
			numberOfOrbs,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	lockAllOrbs() {
		return this.lockOrbs(
			['fire', 'water', 'wood', 'light', 'dark', 'heart', 'poison', 'mortalPoison', 'jammer', 'bomb'],
			42
		);
	}

	convertOrbs(
		fromAttribute1: Attribute,
		toAttribute1: Attribute,
		fromAttribute2: Attribute,
		toAttribute2: Attribute
	) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			20,
			6,
			10,
			'',
			this.convertAttributeToInteger(fromAttribute1),
			this.convertAttributeToInteger(toAttribute1),
			this.convertAttributeToInteger(fromAttribute2),
			this.convertAttributeToInteger(toAttribute2),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	healOverTime(percentage: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			179,
			0,
			0,
			'',
			numberOfTurns,
			0,
			percentage,
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	changeSelfAttribute(attribute: Attribute, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			142,
			6,
			10,
			'',
			numberOfTurns,
			this.convertAttributeToInteger(attribute),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	boardChange(attributes: Attributes) {
		let skillIndex = this.skillData.skill.length;
		// let colors = [];

		// if (attributes.length > 7) {
		//   console.log('Maximum 7 attributes allowed for boardChange active. Trimming...');
		//   attributes = attributes.slice(0, 7);
		// }

		// attributes.forEach(attribute => {
		//   colors.push(this.convertAttributeToInteger(attribute));
		// });

		// this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 71, 6, 12, '', ...colors, -1];
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			154,
			0,
			0,
			'',
			1023 /* For full board */,
			this.convertAttributeArrayToBinary(attributes),
		];

		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	createOrbsAtFixedPosition(attribute: Attribute, rowPositionArray: string[]) {
		/**
		 * Position should be in this format (1 to mark, 0 means untouched)
		 * [
		 *  '000001', //Top row
		 *  '000001', //Second row
		 *  ...
		 * ]
		 */
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			176,
			1,
			13,
			'',
			this.convertPositionToInteger(rowPositionArray[0]),
			this.convertPositionToInteger(rowPositionArray[1]),
			this.convertPositionToInteger(rowPositionArray[2]),
			this.convertPositionToInteger(rowPositionArray[3]),
			this.convertPositionToInteger(rowPositionArray[4]),
			this.convertAttributeToInteger(attribute),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	createOrbsAsColumn(attributeAndColumnPositionJSONPairs: any[]) {
		/**
		 * Format like: [
		 *  { fire: 1 //Left most column, etc.},
		 *  { fire: 2 //2nd column, etc.}
		 * ]
		 */

		if (Object.keys(attributeAndColumnPositionJSONPairs).length > 4) {
			console.log('createOrbsAsColumn can only take up to 4 non-heart attribute at a time');
		}

		let data = [];

		attributeAndColumnPositionJSONPairs.forEach((pair) => {
			Object.keys(pair).forEach((attribute) => {
				let position = '1'.padStart(pair[attribute], '0').padEnd(6, '0').split('').reverse().join('');
				data.push(parseInt(position, 2));
				data.push(this.convertAttributeArrayToBinary(attribute as Attribute));
			});
		});

		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 127, 0, 0, '', ...data];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	createOrbsAsRow(attributeAndRowPositionJSONPairs: any[]) {
		/**
		 * Format like: [
		 *  { fire: 1 //Top row, etc.},
		 *  { fire: 2 //Second row, etc.}
		 * ]
		 */

		if (Object.keys(attributeAndRowPositionJSONPairs).length > 4) {
			console.log('createOrbsAsRow can only take up to 4 non-heart attribute at a time');
		}

		let data = [];

		attributeAndRowPositionJSONPairs.forEach((pair) => {
			Object.keys(pair).forEach((attribute) => {
				let position = '1'.padStart(pair[attribute], '0').padEnd(5, '0').split('').reverse().join('');
				data.push(parseInt(position, 2));
				data.push(this.convertAttributeArrayToBinary(attribute as Attribute));
			});
		});

		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 128, 0, 0, '', ...data];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	counterAttack(attribute: Attribute, counterMultiplier: number, numberOfTurns: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [
			this.skillName,
			this.skillDescription,
			60,
			11,
			20,
			'',
			numberOfTurns,
			counterMultiplier * 100,
			this.convertAttributeToInteger(attribute),
		];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	immediateTrueDamageToAllEnemies(damage: number) {
		let skillIndex = this.skillData.skill.length;
		this.skillData.skill[skillIndex] = [this.skillName, this.skillDescription, 56, 6, 10, '', damage];
		this.resetNameAndDescription();
		this.skill.push(skillIndex);
		return skillIndex;
	}

	getSkillMap() {
		this._skillMap.push({
			exec: 'transform',
			description: 'Transform into another card',
			params: [['ID of Card to Transform Into', 'number']],
		});

		this._skillMap.push({
			exec: 'increaseSkyfall',
			description: 'Increase the skyfall of certain attributes for a number of turns',
			params: [
				['Attributes', 'attributes'],
				['Skyfall Increase Percent', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'unlockOrbs',
			description: 'Unlock Orbs',
			params: [],
		});

		this._skillMap.push({
			exec: 'addCombos',
			description: 'Add combos for a number of turns',
			params: [
				['Number of Combo +', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'increaseRCV',
			description: 'Increase RCV for a number of turns',
			params: [
				['RCV Multiplier', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'increaseAttributeAttack',
			description: 'Increase the ATK of an attribute for a number of turns',
			params: [
				['Attribute', 'attribute'],
				['ATK Multiplier', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'recoverUnmatchable',
			description: 'Recover unmatchable status for a number of turns',
			params: [['Number of Turns', 'number']],
		});

		this._skillMap.push({
			exec: 'recoverBindsAndHP',
			description: 'Recover bind, awaken bind and HP',
			params: [
				['Bind Clear Number of Turns', 'number'],
				['Awoken Bind Clear Number of Turns', 'number'],
				['HP Recovery in Percent', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'increaseTime',
			description: 'Extend time to move Orbs',
			params: [
				['Increase By', 'number'],
				['Is This Increment Multiplicative?', 'boolean'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'haste',
			description: 'Haste',
			params: [
				['Minimum Number of Turns', 'number'],
				['Maximum Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'voidAbsorption',
			description: 'Void Attribute/Damage absorption for a number of turns',
			params: [
				['Void Damage Absorption?', 'boolean'],
				['Void Attribute Absorption', 'boolean'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'voidVoid',
			description: 'Void Damage Void for a number of turns',
			params: [['Number of Turns', 'number']],
		});

		this._skillMap.push({
			exec: 'delay',
			description: 'Delay all enemies for a number of turns',
			params: [['Number of Turns', 'number']],
		});

		this._skillMap.push({
			exec: 'gravity',
			description: 'Gravity all enemies',
			params: [
				['Gravity Percent', 'number'],
				['Is this True Gravity?', 'boolean'],
			],
		});

		this._skillMap.push({
			exec: 'enhanceOrbs',
			description: 'Enhanced selected attributes',
			params: [['Attributes', 'attributes']],
		});

		this._skillMap.push({
			exec: 'suicide',
			description: 'Suicide',
			params: [['Percent of HP Loss', 'number']],
		});

		this._skillMap.push({
			exec: 'createOrbs',
			description: 'Creates a number of Orbs on the board',
			params: [
				['Number of Each Color Spawned', 'number'],
				['Create These Attributes', 'attributes'],
				['Do not Create over These Attributes', 'attributes'],
			],
		});

		this._skillMap.push({
			exec: 'shield',
			description: 'Shield',
			params: [
				['Percent', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'createSpinners',
			description: 'Create a number of spinners in random places on the board for a number of turns',
			params: [
				['Speed In Seconds', 'number'],
				['Number Of Spinners', 'number'],
				['Number Of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'refreshBoard',
			description: 'Refresh the board',
			params: [],
		});

		this._skillMap.push({
			exec: 'noSkyfall',
			description: 'No skyfall for a number of turns',
			params: [['Number Of Turns', 'number']],
		});

		this._skillMap.push({
			exec: 'changeEnemyAttribute',
			description: "Change enemies's attributes",
			params: [['Attribute', 'attribute']],
		});

		this._skillMap.push({
			exec: 'poisonEnemies',
			description: 'Poison all enemies',
			params: [['Multiplier', 'number']],
		});

		this._skillMap.push({
			exec: 'enhanceSkyfallOrbs',
			description: 'Enhanced skyfall Orbs for a number of turns',
			params: [
				['Percent', 'number'],
				['Number Of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'lockOrbs',
			description: 'Lock specific Orbs',
			params: [
				['Attributes', 'attributes'],
				['Number Of Orbs', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'lockAllOrbs',
			description: 'Lock all Orbs',
			params: [],
		});

		this._skillMap.push({
			exec: 'convertOrbs',
			description: 'Convert 1/2 attributes to different 1/2 attributes',
			params: [
				['From Attribute 1', 'attribute'],
				['To Attribute 1', 'attribute'],
				['From Attribute 2', 'attribute'],
				['To Attribute 2', 'attribute'],
			],
		});

		this._skillMap.push({
			exec: 'healOverTime',
			description: 'Heal over time',
			params: [
				['Percentage', 'number'],
				['Number Of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'changeSelfAttribute',
			description: 'Change own attribute',
			params: [
				['Attribute', 'attribute'],
				['Number Of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'boardChange',
			description: 'Change the board into selected attributes',
			params: [['Attributes', 'attributes']],
		});

		this._skillMap.push({
			exec: 'createOrbsAtFixedPosition',
			description: 'Create Orbs at fixed position',
			params: [
				['Attribute', 'attribute'],
				['Board Position', 'boardPosition'],
			],
		});

		this._skillMap.push({
			exec: 'createOrbsAsColumn',
			description: 'Create Orbs in a column formation',
			params: [
				['Attribute #1', 'attribute'],
				['Column Position #1', 'columnPosition'],
				['Attribute #2', 'attribute'],
				['Column Position #2', 'columnPosition'],
				['Attribute #3', 'attribute'],
				['Column Position #3', 'columnPosition'],
				['Attribute #4', 'attribute'],
				['Column Position #4', 'columnPosition'],
			],
		});

		this._skillMap.push({
			exec: 'createOrbsAsRow',
			description: 'Create Orbs in a row formation',
			params: [
				['Attribute #1', 'attribute'],
				['Row Position #1', 'rowPosition'],
				['Attribute #2', 'attribute'],
				['Row Position #2', 'rowPosition'],
				['Attribute #3', 'attribute'],
				['Row Position #3', 'rowPosition'],
				['Attribute #4', 'attribute'],
				['Row Position #4', 'rowPosition'],
			],
		});

		this._skillMap.push({
			exec: 'counterAttack',
			description: 'Counter attack x amount of damage received for a number of turns',
			params: [
				['Counter Attack Damage Attribute', 'attribute'],
				['Counter Attack Multiplier', 'number'],
				['Number of Turns', 'number'],
			],
		});

		this._skillMap.push({
			exec: 'immediateTrueDamageToAllEnemies',
			description: 'Inflict immediate true damage to all enemies',
			params: [['Amount of Damage', 'number']],
		});

		return this._skillMap;
	}
}
