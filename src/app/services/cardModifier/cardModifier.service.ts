import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CardModifier {
	editCardInfo(cardData, cardId, newData) {
		cardData.card[cardId] = newData;
		return cardData;
	}

	updateCardActiveSkill(cardData, cardId, skillId) {
		console.log(`Updating active skill for ${cardId} from ${cardData.card[cardId][25]} to #${skillId}...`);
		cardData.card[cardId][25] = skillId;
		return cardData;
	}

	updateCardLeaderSkill(cardData, cardId, skillId) {
		console.log(`Updating leader skill for ${cardId} from ${cardData.card[cardId][26]} to #${skillId}...`);
		cardData.card[cardId][26] = skillId;
		return cardData;
	}

	setAwakenings(cardData, cardId, awakenings) {
		let skillCount = cardData.card[cardId][57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData.card[cardId][numberOfAwakeningsIndex];

		//Remove the existing awakenings
		cardData.card[cardId].splice(numberOfAwakeningsIndex + 1, numberOfAwakenings);

		//Split array into 2 parts, part 1 ends with numberOfAwakeningIndex index
		//Part 2 is the rest of the array
		//Then combine them with new awakenings
		let remaining = cardData.card[cardId].splice(numberOfAwakeningsIndex + 1);
		cardData.card[cardId].push(...awakenings, ...remaining);

		//Update numberOfAwakenings
		cardData.card[cardId][numberOfAwakeningsIndex] = awakenings.length;

		return cardData;
	}

	setSuperAwakenings(cardData, cardId, awakenings) {
		let skillCount = cardData.card[cardId][57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData.card[cardId][numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;

		cardData.card[cardId][superAwakeningsIndex] = awakenings.join(',');

		return cardData;
	}

	setMonsterPoints(cardData, cardId, monsterPoints) {
		let skillCount = cardData.card[cardId][57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData.card[cardId][numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;
		let monsterPointIndex = superAwakeningsIndex + 4;

		cardData.card[cardId][monsterPointIndex] = monsterPoints;

		return cardData;
	}

	setInheritanceType(cardData, cardId, isInheritable: boolean, isExtraSlottable: boolean) {
		let skillCount = cardData.card[cardId][57];
		let moveSets = skillCount * 3;
		let numberOfAwakeningsIndex = 57 + moveSets + 1;
		let numberOfAwakenings = cardData.card[cardId][numberOfAwakeningsIndex];
		let superAwakeningsIndex = numberOfAwakeningsIndex + numberOfAwakenings + 1;
		let inheritanceTypeIndex = superAwakeningsIndex + 7;

		let inheritFlag = 1,
			extraSlotFlag = 32,
			flag = 0;
		if (isInheritable) flag += inheritFlag;
		if (isExtraSlottable) flag += extraSlotFlag;

		cardData.card[cardId][inheritanceTypeIndex] = flag;

		return cardData;
	}
}
