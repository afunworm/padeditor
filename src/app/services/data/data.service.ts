import { Injectable } from '@angular/core';
const cardData = require('../../../assets/raw/download_card_data.json');
const skillData = require('../../../assets/raw/download_skill_data.json');
import { CardModifier } from '../cardModifier/cardModifier.service';
import { Attribute, Attributes, Type, Types } from '../../interfaces/card.interfaces';
import { ActiveSkillService } from '../activeSkills/activeSkills.service';
import { LeaderSkillService } from '../leaderSkills/leaderSkills.service';
import { sortBy } from 'lodash';

@Injectable({ providedIn: 'root' })
export class DataService {
	constructor(
		private _cardModifier: CardModifier,
		private _activeSkill: ActiveSkillService,
		private _leaderSkill: LeaderSkillService
	) {}

	getCardData() {
		return cardData.card.slice();
	}

	getSkillData() {
		return skillData.skill.slice();
	}

	getCardMaxNo() {
		return 6623;
	}

	get key() {
		return '11afunworm11';
	}

	encrypt(input: string) {
		const CryptoJS = require('crypto-js');
		return CryptoJS.AES.encrypt(input, this.key).toString();
	}

	decrypt(input: string) {
		const CryptoJS = require('crypto-js');
		return CryptoJS.AES.decrypt(input, this.key).toString(CryptoJS.enc.Utf8);
	}

	getCardAwakenings(cardData: any[]) {
		let skillCount = cardData[57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData[numberOfAwakeningsIndex];

		let awakenings = [];
		for (let i = 1; i <= numberOfAwakenings; i++) {
			awakenings.push(cardData[numberOfAwakeningsIndex + i]);
		}

		return awakenings;
	}

	getCardSuperAwakenings(cardData: any[]) {
		let skillCount = cardData[57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData[numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;
		let awakenings = cardData[superAwakeningsIndex];

		return awakenings.split(',').filter((a) => a !== '').length ? awakenings.split(',').map((a) => Number(a)) : [];
	}

	getCardMonsterPoints(cardData: any[]) {
		let skillCount = cardData[57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData[numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;
		let monsterPointIndex = superAwakeningsIndex + 4;

		return cardData[monsterPointIndex];
	}

	getInheritanceType(cardData: any[]) {
		let skillCount = cardData[57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData[numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;
		let inheritanceTypeIndex = superAwakeningsIndex + 7;

		return {
			isExtraSlottable: (cardData[inheritanceTypeIndex] & 32) === 32,
			isInheritable: (cardData[inheritanceTypeIndex] & 1) === 1,
		};
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
		return map[attribute] !== undefined ? map[attribute] : -1;
	}

	getAvailableAwakenings() {
		return [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			46,
			47,
			48,
			49,
			50,
			51,
			52,
			53,
			54,
			55,
			56,
			57,
			58,
			59,
			60,
			61,
			62,
			63,
			64,
			65,
			66,
			67,
			68,
			69,
			70,
			71,
			72,
		];
	}

	getAvailableAttributes() {
		return ['fire', 'water', 'wood', 'light', 'dark', 'heart', 'jammer', 'poison', 'mortalPoison', 'bomb'];
	}

	getAvailableTypes() {
		return [
			'redeemable',
			'enhance',
			'awaken',
			'machine',
			'devil',
			'attacker',
			'god',
			'dragon',
			'healer',
			'physical',
			'balanced',
			'evo',
		];
	}

	processAttributes(attributeJSON) {
		let result = [];
		for (let attribute in attributeJSON) {
			if (attributeJSON[attribute]) result.push(attribute);
		}
		return result;
	}

	processTypes(typeJSON) {
		let result = [];
		for (let type in typeJSON) {
			if (typeJSON[type]) result.push(type);
		}
		return result;
	}

	processBoardPosition(positionJSON) {
		let indexReplace = (input: string | number, index: number, replacement: string | number) => {
			input = input.toString();
			replacement = replacement.toString();
			return input.substr(0, index) + replacement + input.substr(index + replacement.length);
		};

		let board: any[] = ['000000', '000000', '000000', '000000', '000000'];

		for (let position in positionJSON) {
			let rowIndex = Number(position.split('_')[0]);
			let columnIndex = Number(position.split('_')[1]);
			if (positionJSON[position] === true) {
				board[rowIndex] = indexReplace(board[rowIndex], columnIndex, '1');
			}
		}
		return board;
	}

	processAttributeAndColumnPositionJSONPairs(attributeAndColumnPositionJSONPairs) {
		let getColumnIndex = (columnJSON) => {
			if (!Object.keys(columnJSON).length) return -1;

			let firstFound = null;
			for (let k in columnJSON) {
				if (!firstFound) firstFound = k;
			}

			return firstFound.includes('_') ? Number(firstFound.split('_')[1]) + 1 : -1;
		};

		let result = [];
		for (let i = 0; i < attributeAndColumnPositionJSONPairs.length; i += 2) {
			if (Object.keys(attributeAndColumnPositionJSONPairs[i + 1]).length === 0) continue;

			let attribute = attributeAndColumnPositionJSONPairs[i];
			let columnIndex = getColumnIndex(attributeAndColumnPositionJSONPairs[i + 1]);

			if (columnIndex === -1) continue;

			let toPush = {};
			toPush[attribute] = columnIndex;
			result.push(toPush);
		}

		return result;
	}

	processAttributeAndMultiplierJSONPairs(attributeAndMultiplierJSONPairs) {
		let result = {};

		for (let i = 0; i < attributeAndMultiplierJSONPairs.length; i += 2) {
			let attribute = attributeAndMultiplierJSONPairs[i];
			let multiplier = attributeAndMultiplierJSONPairs[i + 1];
			result[attribute] = multiplier;
		}

		return result;
	}

	processAttributeAndRowPositionJSONPairs(attributeAndRowPositionJSONPairs) {
		let getRowIndex = (rowJSON) => {
			if (!Object.keys(rowJSON).length) return -1;

			let firstFound = null;
			for (let k in rowJSON) {
				if (!firstFound) firstFound = k;
			}

			return firstFound.includes('_') ? Number(firstFound.split('_')[0]) + 1 : -1;
		};

		let result = [];
		for (let i = 0; i < attributeAndRowPositionJSONPairs.length; i += 2) {
			if (Object.keys(attributeAndRowPositionJSONPairs[i + 1]).length === 0) continue;

			let attribute = attributeAndRowPositionJSONPairs[i];
			let rowIndex = getRowIndex(attributeAndRowPositionJSONPairs[i + 1]);

			if (rowIndex === -1) continue;

			let toPush = {};
			toPush[attribute] = rowIndex;
			result.push(toPush);
		}

		return result;
	}

	sortChangeQueue(changeQueue) {
		//Run through the queue and sort them by queue.cardId
		let queueParts = {};
		changeQueue.forEach((queue) => {
			if (queueParts[queue.cardId] === undefined) {
				queueParts[queue.cardId] = [];
				queueParts[queue.cardId].push(queue);
			} else {
				queueParts[queue.cardId].push(queue);
			}
		});

		let result = [];
		for (let cardId in queueParts) {
			let part = queueParts[cardId];
			let sortedPart = sortBy(part, function (queue) {
				let priority = { i: 1, l: 3, a: 2 };
				return priority[queue.type];
			});
			result.push(...sortedPart);
		}

		return result;
	}

	compileDataChanges(originalChangeQueue): { cardData: any; skillData: any; log: string } {
		//Get a fresh copy of card data & skill data & changeQueue
		originalChangeQueue = JSON.parse(JSON.stringify(originalChangeQueue));
		let cards = JSON.parse(JSON.stringify(cardData));
		let skills = JSON.parse(JSON.stringify(skillData));
		let log = [];

		let changeQueue = [];
		Object.keys(originalChangeQueue).forEach((cardId) => {
			let queue = originalChangeQueue[cardId];
			let cardName = cards.card[cardId][1];

			changeQueue.push(queue[0]); //Info

			if (queue[1] && Object.keys(queue[1]).length > 0) {
				changeQueue.push({
					...queue[1], //Active
					cardId: cardId,
					cardName: cardName,
				});
			}

			if (queue[2] && Object.keys(queue[2]).length > 0) {
				changeQueue.push({
					...queue[2], //Leader
					cardId: cardId,
					cardName: cardName,
				});
			}
		});

		// console.log(changeQueue);
		// return { cardData: '', skillData: '', log: '' };

		changeQueue.forEach((queue) => {
			if (queue.data !== undefined) {
				/* Processing changes for info */
				cards = this._cardModifier.editCardInfo(cards, queue.cardId, queue.data.data); //This line causes the overriding of existing change, so i must be last
				log.push(`[*] Modified stats for ${queue.cardId}. ${queue.cardName}`);
				cards = this._cardModifier.setAwakenings(cards, queue.cardId, queue.data.awakenings);
				log.push(`[*] Modified awakenings for ${queue.cardId}. ${queue.cardName}`);
				cards = this._cardModifier.setSuperAwakenings(cards, queue.cardId, queue.data.superAwakenings);
				log.push(`[*] Modified super awakenings for ${queue.cardId}. ${queue.cardName}`);
			} else {
				/* Processing changes for active & leader */
				if (queue.maxCDLevel !== undefined) {
					//Active
					//Register datasource to use
					this._activeSkill.registerDataSource(skills);

					//Processing
					let parts = queue.parts;
					log.push(
						`\n\n[-] Changing active skills for ${queue.cardId}. ${queue.cardName}. ${parts.length} part(s) detected`
					);

					this._activeSkill.createNewSkill(
						queue.name,
						queue.description,
						queue.maxCDLevel,
						queue.turnAtCDLv1
					);
					log.push(`[+] Created new skill ${queue.name}`);

					log.push(`[-] Adding skill parts to skill ${queue.name}`);
					parts.forEach((part) => {
						let exec = part.exec;

						log.push(`[-] Verifying skill`);
						if (!this._activeSkill.isExecutable(exec)) {
							log.push(`[x] Unable to execute ${exec}(). Skipping...`);
							return;
						}

						/**
						 * Good to go:
						 *  + attribute (fire, water, etc.); number and boolean
						 */
						log.push(`[-] Processing all param variables...`);
						part.paramTemplates.forEach((param, index) => {
							if (param[1] === 'attributes') {
								//{ "fire": false, "water": true, "wood": true } => ['water', 'wood']
								part.params[index] = this.processAttributes(part.params[index]);
							} else if (param[1] === 'boardPosition') {
								//{ row_column: boolean } => [ '000000', '000000', etc...]
								part.params[index] = this.processBoardPosition(part.params[index]);
							}
						});

						let newSkillId;

						//Specifically handles params for createOrbsAsColumn and createOrbsAsRow
						if (exec === 'createOrbsAsColumn') {
							part.params = this.processAttributeAndColumnPositionJSONPairs(part.params);
							newSkillId = this._activeSkill[exec].call(this._activeSkill, part.params);
						} else if (exec === 'createOrbsAsRow') {
							part.params = this.processAttributeAndRowPositionJSONPairs(part.params);
							newSkillId = this._activeSkill[exec].call(this._activeSkill, part.params);
						} else {
							newSkillId = this._activeSkill[exec].call(this._activeSkill, ...part.params);
						}

						log.push(`[+] Added skill part ${exec}() #${newSkillId}`);
					});

					let skillId = this._activeSkill.finalizeChanges();
					skills = this._activeSkill.getModifiedDataSource();

					//Reassign new skills to the card
					log.push(`[-] Overwriting the active skill for ${queue.cardId}. ${queue.cardName}...`);
					cards = this._cardModifier.updateCardActiveSkill(cards, queue.cardId, skillId);
					console.log('New AS ID is ', cards.card[queue.cardId][25]);
					log.push(`[*] Finished modifying skill data for ${queue.name} #${skillId}`);
				} else {
					/* Processing changes for l */
					//Register datasource to use
					this._leaderSkill.registerDataSource(skills);

					//Processing
					let parts = queue.parts;
					log.push(
						`[-] Changing leader skills for ${queue.cardId}. ${queue.cardName}. ${parts.length} part(s) detected`
					);

					this._leaderSkill.createNewSkill(queue.name, queue.description);
					log.push(`[+] Created new skill ${queue.name}`);

					log.push(`[-] Adding skill parts to skill ${queue.name}`);
					parts.forEach((part) => {
						let exec = part.exec;

						log.push(`[-] Verifying skill`);
						if (!this._leaderSkill.isExecutable(exec)) {
							log.push(`[x] Unable to execute ${exec}(). Skipping...`);
							return;
						}

						/**
						 * Good to go:
						 *  + attribute (fire, water, etc.), type, number and boolean
						 */
						log.push(`[-] Processing all param variables...`);
						part.paramTemplates.forEach((param, index) => {
							if (param[1] === 'attributes') {
								//{ "fire": false, "water": true, "wood": true } => ['water', 'wood']
								part.params[index] = this.processAttributes(part.params[index]);
							} else if (param[1] === 'types') {
								//{ row_column: boolean } => [ '000000', '000000', etc...]
								part.params[index] = this.processTypes(part.params[index]);
							}
						});

						let newSkillId;

						//Specifically handles params for attributeAndMultiplierJSONPairs
						if (exec === 'boostATKForAttributeCrossMatch') {
							part.params = this.processAttributeAndMultiplierJSONPairs(part.params);
							newSkillId = this._leaderSkill[exec].call(this._leaderSkill, part.params);
						} else {
							newSkillId = this._leaderSkill[exec].call(this._leaderSkill, ...part.params);
						}

						log.push(`[+] Added skill part ${exec}() #${newSkillId}`);
					});

					let skillId = this._leaderSkill.finalizeChanges();
					skills = this._leaderSkill.getModifiedDataSource();

					//Reassign new skills to the card
					log.push(`[-] Overwriting the leaderskill for ${queue.cardId}. ${queue.cardName}...`);
					cards = this._cardModifier.updateCardLeaderSkill(cards, queue.cardId, skillId);
					console.log('New LS ID is ', cards.card[queue.cardId][26]);
					log.push(`[*] Finished modifying skill data for ${queue.name} #${skillId}`);
				}
			}
		});

		return {
			cardData: cards,
			skillData: skills,
			log: log.join('\n'),
		};
	}
}
