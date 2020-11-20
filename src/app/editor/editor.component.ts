import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from '../services/data/data.service';
import { NotificationService } from '../services/notification/notification.service';
import { ActiveSkillService } from '../services/activeSkills/activeSkills.service';
import { LeaderSkillService } from '../services/leaderSkills/leaderSkills.service';
import { LoadingService } from '../services/loading/loading.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/remote-config';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
	padNameControl = new FormControl();
	nameDatabase: string[] = [];
	cardData;
	skillData;
	nameFilteredOptions: Observable<string[]>;
	selectedName: string;
	selectedCardData;
	selectedCardAwakenings = [];
	selectedCardSuperAwakenings = [];
	editingAwakeningMode: boolean = false;
	compilingMode: boolean = false;
	isCompiling: boolean = false;
	isEditingSA: boolean = false;
	changeQueueExportMode: boolean = false;
	changeQueueExport: string = '';
	changeQueueImport: string = '';
	overwriteChangeQueueOnImport: boolean = false;
	availableAwakenings = this._dataService.getAvailableAwakenings();
	availableAttributes = this._dataService.getAvailableAttributes();
	availableTypes = this._dataService.getAvailableTypes();
	changeQueue: {
		[id: string]: (
			| {
					cardId?: number;
					cardName?: string;
					icon?: string;
					data?: {
						data: any[];
						awakenings: number[];
						superAwakenings: number[];
					};
					name?: string;
					description?: string;
					maxCDLevel?: number;
					turnAtCDLv1?: number;
					parts?: { exec: string; templateDescription: string; params: any[]; paramTemplates: any[] }[];
			  }
			| any
		)[];
	} = {};
	activeSkillMap;
	leaderSkillMap;
	originalActiveSkill;
	originalLeaderSkill;
	originalActiveSkillString;
	originalLeaderSkillString;
	currentChangingQueueIndex;
	currentChangingQueueCardId;
	currentCardIconUrl;
	cardDataOutput = '';
	skillDataOutput = '';
	logOutput = '';
	cloudQueue = {};
	uid: string = '';
	isFirestoring: boolean = false;
	@ViewChild('queueContainer') private queueContainer: ElementRef;

	constructor(
		private _dataService: DataService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _notificationService: NotificationService,
		private _activeSkillService: ActiveSkillService,
		private _leaderSkillService: LeaderSkillService,
		private _loadingService: LoadingService
	) {}

	ngOnInit() {
		//Verify things
		const auth = firebase.auth();
		const firestore = firebase.firestore();

		auth.onAuthStateChanged(async (user) => {
			try {
				let loggedInUserId = user.uid; // We recommend to call `load` at application startup.
				const fpjs = await FingerprintJS.load();
				const result = await fpjs.get();
				const visitorId = result.visitorId;

				//Assign uid
				this.uid = user.uid;

				//Check if user is authorized
				const remoteConfig = firebase.remoteConfig();
				remoteConfig.settings = {
					minimumFetchIntervalMillis: 10000,
					fetchTimeoutMillis: 60000,
				};
				await remoteConfig.fetchAndActivate();
				let fingerprints = JSON.parse(remoteConfig.getValue('authorized').asString());

				//If users are not authorized or not logged in, redirected to fingerprints
				console.log(loggedInUserId);
				console.log(fingerprints);
				if (!fingerprints.includes(loggedInUserId) || !user) {
					this._router.navigate(['fingerprints'], { relativeTo: this._activatedRoute });
				}

				//Log visits
				await firestore.collection('Users').doc(loggedInUserId).collection('Logs').add({
					fingerprint: visitorId,
					_createdAt: new Date(),
				});

				//Load cloud queues
				let cloudQueueSnapshot = await firestore
					.collection('Users')
					.doc(loggedInUserId)
					.collection('Queues')
					.orderBy('_createdAt', 'desc')
					.get();
				cloudQueueSnapshot.forEach((queue) => {
					this.cloudQueue[queue.id] = queue.data();
				});

				//Generate nameDatabase
				let cardData = this._dataService.getCardData();
				let maxCardNo = this._dataService.getCardMaxNo();
				cardData.forEach((card) => {
					let cardId = card[0];
					let cardName = card[1];

					if (cardId > 0 && cardId <= maxCardNo) {
						this.nameDatabase.push(cardId + '. ' + cardName);
					}
				});
				//Filter for Name
				this.nameFilteredOptions = this.padNameControl.valueChanges.pipe(
					startWith(''),
					map((value) => (value.length >= 3 ? this._filterName(value) : []))
				);

				//Load card & skill data
				this.cardData = this._dataService.getCardData();
				this.skillData = this._dataService.getSkillData();
				window['cardData'] = this.cardData;
				window['skillData'] = this.skillData;

				//Get skill maps
				this.activeSkillMap = this._activeSkillService
					.getSkillMap()
					.sort((a, b) => a.description.localeCompare(b.description));
				this.leaderSkillMap = this._leaderSkillService
					.getSkillMap()
					.sort((a, b) => a.description.localeCompare(b.description));

				//Page loaded
				this._loadingService.pageLoaded();
			} catch (error) {
				this._notificationService.error(error);
				this._loadingService.pageLoaded();
			}
		});
	}

	private _filterName(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.nameDatabase.filter((option) => option.toLowerCase().includes(filterValue));
	}

	loadCard(skippedCreateChangeQueueEntry: boolean = false) {
		if (!this.selectedName || this.selectedName.indexOf('.') === -1) {
			this._notificationService.alert('Please search for a card to load.');
			return;
		}

		let cardId = this.selectedName.split('.')[0];
		this.currentChangingQueueCardId = Number(cardId);
		this.currentCardIconUrl = 'https://static.pad.byh.uy/icons/' + cardId.padStart(5, '0') + '.png';

		//Load card data
		this.selectedCardData = this.cardData[cardId];

		if (this.changeQueue[cardId] && Object.keys(this.changeQueue[cardId][1]).length > 0) {
			//Load skill
			let skillID = this.selectedCardData[25];
			this.originalActiveSkill = this.skillData[skillID];
			this.originalActiveSkillString =
				'<strong>' + this.skillData[skillID][0] + '</strong> - ' + this.skillData[skillID][1];
			skillID = this.selectedCardData[26];
		}

		if (this.changeQueue[cardId] && Object.keys(this.changeQueue[cardId][2]).length > 0) {
			//Load skill
			let skillID = this.selectedCardData[26];
			this.originalLeaderSkill = this.skillData[skillID];
			this.originalLeaderSkillString =
				'<strong>' + this.skillData[skillID][0] + '</strong> - ' + this.skillData[skillID][1];
		}

		//Adding changing info into queue
		if (!skippedCreateChangeQueueEntry) this.createChangeQueueItem();
	}

	createChangeQueueItem() {
		this.changeQueue[this.currentChangingQueueCardId] = [];
		this.changeQueue[this.currentChangingQueueCardId].push(
			{
				cardId: this.selectedCardData[0],
				cardName: this.selectedCardData[1],
				icon:
					'https://static.pad.byh.uy/icons/' + this.selectedCardData[0].toString().padStart(5, '0') + '.png',
				data: {
					data: this.selectedCardData,
					awakenings: this._dataService.getCardAwakenings(this.selectedCardData),
					superAwakenings: this._dataService.getCardSuperAwakenings(this.selectedCardData),
					monsterPoints: this._dataService.getCardMonsterPoints(this.selectedCardData),
					isExtraSlottable: this._dataService.getInheritanceType(this.selectedCardData).isExtraSlottable,
					isInheritable: this._dataService.getInheritanceType(this.selectedCardData).isInheritable,
				},
			},
			{
				/* Active */
			},
			{
				/* Leader */
			}
		);

		this.scrollQueueContainerToBottom();
	}

	addNewAwakening(awakeningId) {
		if (this.isEditingSA) {
			if (this.changeQueue[this.currentChangingQueueCardId][0].data.superAwakenings.length >= 9) {
				this._notificationService.alert('The maximum number of awakenings is 9.');
				return;
			}

			this.changeQueue[this.currentChangingQueueCardId][0].data.superAwakenings.push(awakeningId);
		} else {
			if (this.changeQueue[this.currentChangingQueueCardId][0].data.awakenings.length >= 9) {
				this._notificationService.alert('The maximum number of awakenings is 9.');
				return;
			}
			this.changeQueue[this.currentChangingQueueCardId][0].data.awakenings.push(awakeningId);
		}
	}

	removeAwakening(index) {
		if (this.isEditingSA) {
			this.changeQueue[this.currentChangingQueueCardId][0].data.superAwakenings.splice(index, 1);
		} else {
			this.changeQueue[this.currentChangingQueueCardId][0].data.awakenings.splice(index, 1);
		}
	}

	editAwakenings() {
		this.isEditingSA = false;
		this.editingAwakeningMode = true;
	}

	editSuperAwakenings() {
		this.isEditingSA = true;
		this.editingAwakeningMode = true;
	}

	scrollQueueContainerToBottom() {
		try {
			this.queueContainer.nativeElement.scrollTop = this.queueContainer.nativeElement.scrollHeight + 1000;
		} catch (err) {
			console.log(err);
		}
	}

	deepCloneChangeQueue() {
		this.changeQueue = { ...this.changeQueue };
	}

	confirmEditActiveSkills() {
		this._notificationService
			.confirm('Editing Active Skills will void its original skills. Do you wish to continue?')
			.afterClosed()
			.subscribe((confirm) => {
				if (confirm) {
					this.changeQueue[this.currentChangingQueueCardId][1] = {
						name: '',
						description: '',
						maxCDLevel: 1,
						turnAtCDLv1: 7,
						parts: [],
					};
				}
			});
	}

	addActiveSkillPart() {
		if (!this.changeQueue[this.currentChangingQueueCardId][1].parts)
			this.changeQueue[this.currentChangingQueueCardId][1].parts = [];

		this.changeQueue[this.currentChangingQueueCardId][1].parts.push({
			exec: '',
			templateDescription: '',
			paramTemplates: [],
			params: [],
		});

		this.scrollQueueContainerToBottom();
	}

	updateActiveSkillParams(partSkillIndex) {
		let current = this.changeQueue[this.currentChangingQueueCardId][1];
		let currentPart = current.parts[partSkillIndex];

		//Technically currentPart, but do this to avoid immutability
		this.changeQueue[this.currentChangingQueueCardId][1].parts[partSkillIndex] = {
			...currentPart,
			exec: currentPart.exec,
			templateDescription: this.activeSkillMap.filter((skill) => skill.exec === currentPart.exec)[0].description,
			paramTemplates: this.activeSkillMap.filter((skill) => skill.exec === currentPart.exec)[0].params,
		};

		//Create array for attributes & types
		this.changeQueue[this.currentChangingQueueCardId][1].parts[partSkillIndex].paramTemplates.forEach(
			(template, index) => {
				if (template[1] === 'attributes' || template[1] === 'types') {
					currentPart.params[index] = {};
				} else if (template[1] === 'attribute') {
					currentPart.params[index] = 'fire';
				} else if (template[1] === 'attributeWithNone') {
					currentPart.params[index] = 'none';
				} else if (template[1] === 'type') {
					currentPart.params[index] = 'devil';
				} else if (template[1] === 'boolean') {
					currentPart.params[index] = true;
				} else if (template[1] === 'number') {
					currentPart.params[index] = 0;
				} else if (
					template[1] === 'boardPosition' ||
					template[1] === 'columnPosition' ||
					template[1] === 'rowPosition'
				) {
					currentPart.params[index] = {};
				}
			}
		);
	}

	resetActiveSkills() {
		this._notificationService
			.confirm('Editing Active Skills will void its original skills. Do you wish to continue?')
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][1] = {};

				this.scrollQueueContainerToBottom();
			});
	}

	confirmEditLeaderSkills() {
		this._notificationService
			.confirm('Editing Leader Skills will void its original skills. Do you wish to continue?')
			.afterClosed()
			.subscribe((confirm) => {
				if (confirm) {
					this.changeQueue[this.currentChangingQueueCardId][2] = {
						name: '',
						description: '',
						parts: [],
					};
				}
			});
	}

	addLeaderSkillPart() {
		if (!this.changeQueue[this.currentChangingQueueCardId][2].parts)
			this.changeQueue[this.currentChangingQueueCardId][2].parts = [];

		this.changeQueue[this.currentChangingQueueCardId][2].parts.push({
			exec: '',
			templateDescription: '',
			paramTemplates: [],
			params: [],
		});

		this.scrollQueueContainerToBottom();
	}

	updateLeaderSkillParams(partSkillIndex) {
		let current = this.changeQueue[this.currentChangingQueueCardId][2];
		let currentPart = current.parts[partSkillIndex];

		//Technically currentPart, but do this to avoid immutability
		this.changeQueue[this.currentChangingQueueCardId][2].parts[partSkillIndex] = {
			...currentPart,
			exec: currentPart.exec,
			templateDescription: this.leaderSkillMap.filter((skill) => skill.exec === currentPart.exec)[0].description,
			paramTemplates: this.leaderSkillMap.filter((skill) => skill.exec === currentPart.exec)[0].params,
		};

		//Create array for attributes & types
		this.changeQueue[this.currentChangingQueueCardId][2].parts[partSkillIndex].paramTemplates.forEach(
			(template, index) => {
				if (template[1] === 'attributes' || template[1] === 'types') {
					currentPart.params[index] = {};
				} else if (template[1] === 'attribute') {
					currentPart.params[index] = 'fire';
				} else if (template[1] === 'attributeWithNone') {
					currentPart.params[index] = 'none';
				} else if (template[1] === 'type') {
					currentPart.params[index] = 'devil';
				} else if (template[1] === 'boolean') {
					currentPart.params[index] = true;
				} else if (template[1] === 'number') {
					currentPart.params[index] = 0;
				} else if (
					template[1] === 'boardPosition' ||
					template[1] === 'columnPosition' ||
					template[1] === 'rowPosition'
				) {
					currentPart.params[index] = {};
				}
			}
		);
	}

	resetLeaderSkills() {
		this._notificationService
			.confirm('Editing Active Skills will void its original skills. Do you wish to continue?')
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][2] = {};
			});
	}

	removeChangeQueueItem(cardId) {
		this._notificationService
			.confirm('Remove this skill?')
			.afterClosed()
			.subscribe((confirm) => {
				if (confirm) {
					delete this.changeQueue[cardId];
					this.currentChangingQueueCardId = '';
					this.currentCardIconUrl = '';
					this.selectedCardData = undefined;
				}
			});
	}

	JSONStringify(item) {
		return JSON.stringify(item);
	}

	ObjectKeys(obj) {
		return Object.keys(obj);
	}

	editChangeQueueItem(cardId) {
		let message = 'Load this change into the editor?';
		cardId = Number(cardId);

		this._notificationService
			.confirm(message)
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[cardId] = [...this.changeQueue[cardId]];

				let queue = this.changeQueue[cardId];
				this.currentChangingQueueCardId = cardId;
				console.log(queue);

				//Assign namme
				this.selectedName = queue[0].cardId + '. ' + queue[0].cardName;
				//Load card? Run before loadCard()
				this.loadCard(true);
				//Set card data & awakenings for info
				this.selectedCardData = queue[0].data.data;
				this.changeQueue[cardId][0].data.awakenings = queue[0].data.awakenings;
				this.changeQueue[cardId][0].data.superAwakenings = queue[0].data.superAwakenings;
			});
	}

	async compileData() {
		this.isCompiling = true;
		let output = this._dataService.compileDataChanges(this.changeQueue);
		output.cardData.card = output.cardData.card.map((card) => {
			card[4] = 1;
			return card;
		});
		this.cardDataOutput = JSON.stringify(output.cardData);
		this.skillDataOutput = JSON.stringify(output.skillData);
		window['cardData'] = output.cardData['card'];
		window['skillData'] = output.skillData['skill'];
		window['changeQueue'] = this.changeQueue;
		this.logOutput = output.log;
		this.compilingMode = true;
	}

	exportChangeQueue(hideChangeQueue: boolean = false) {
		// this.changeQueue.hidden = [hideChangeQueue];

		if (Object.keys(this.changeQueue).length) {
			this.changeQueueExport = this._dataService.encrypt(JSON.stringify(this.changeQueue));
		}
		this.changeQueueExportMode = true;
	}

	importChangeQueue() {
		if (this.overwriteChangeQueueOnImport) {
			try {
				let changeQueue = JSON.parse(this._dataService.decrypt(this.changeQueueImport));
				this.changeQueue = changeQueue;
				this._notificationService.alert('Change Queue imported successfully.');
			} catch (error) {
				this._notificationService.error(error);
			}
		} else {
			try {
				let changeQueue = JSON.parse(this._dataService.decrypt(this.changeQueueImport));
				this.changeQueue = { ...this.changeQueue, ...changeQueue };
				this._notificationService.alert('Change Queue imported successfully.');
			} catch (error) {
				this._notificationService.error(error);
			}
		}

		this.changeQueueExportMode = false;
	}

	download(type) {
		if (type === 'card') {
			let w = window.open('', 'download_card_data');
			w.document.write(
				`<pre style="width: 100%; white-space: pre-wrap;">${this.cardDataOutput.replace(/\\\\n/g, '\\n')}</pre>`
			);
			setTimeout(() => w.stop(), 1500);
		} else {
			let w = window.open('', 'download_skill_data');
			w.document.write(
				`<pre style="width: 100%; white-space: pre-wrap;">${this.skillDataOutput.replace(
					/\\\\n/g,
					'\\n'
				)}}</pre>`
			);
			setTimeout(() => w.stop(), 1500);
		}
	}

	moveActiveSkillPartUp(index) {
		if (index === 0) return;

		let f = this.changeQueue[this.currentChangingQueueCardId][1].parts.splice(index, 1)[0];
		this.changeQueue[this.currentChangingQueueCardId][1].parts.splice(index - 1, 0, f);
	}

	moveActiveSkillPartDown(index) {
		if (index === this.changeQueue[this.currentChangingQueueCardId][1].parts.length - 1) return;

		let f = this.changeQueue[this.currentChangingQueueCardId][1].parts.splice(index, 1)[0];
		this.changeQueue[this.currentChangingQueueCardId][1].parts.splice(index + 1, 0, f);
	}

	moveLeaderSkillPartUp(index) {
		if (index === 0) return;

		let f = this.changeQueue[this.currentChangingQueueCardId][2].parts.splice(index, 1)[0];
		this.changeQueue[this.currentChangingQueueCardId][2].parts.splice(index - 1, 0, f);
	}

	moveLeaderSkillPartDown(index) {
		if (index === this.changeQueue[this.currentChangingQueueCardId][2].parts.length - 1) return;

		let f = this.changeQueue[this.currentChangingQueueCardId][2].parts.splice(index, 1)[0];
		this.changeQueue[this.currentChangingQueueCardId][2].parts.splice(index + 1, 0, f);
	}

	deleteActiveSkillPart(index) {
		this._notificationService
			.confirm('Removing this leader skill part?')
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][1].parts.splice(index, 1);
			});
	}

	deleteLeaderSkillPart(index) {
		this._notificationService
			.confirm('Removing this leader skill part?')
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][2].parts.splice(index, 1);
			});
	}

	copyAS(cardId) {
		if (!this.currentChangingQueueCardId) {
			this._notificationService.alert('Please load a card into an editor first.');
			return;
		}

		this._notificationService
			.confirm(
				'Copy these active skills to the currently editing card?<br><em>(this function only works on custom skills)</em>'
			)
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][1] = JSON.parse(
					JSON.stringify(this.changeQueue[cardId][1])
				);
			});
	}

	copyLS(cardId) {
		if (!this.currentChangingQueueCardId) {
			this._notificationService.alert('Please load a card into an editor first.');
			return;
		}

		this._notificationService
			.confirm(
				'Copy these active skills to the currently editing card?<br><em>(this function only works on custom skills)</em>'
			)
			.afterClosed()
			.subscribe((confirm) => {
				if (!confirm) return;

				this.changeQueue[this.currentChangingQueueCardId][2] = JSON.parse(
					JSON.stringify(this.changeQueue[cardId][2])
				);
			});
	}

	loadChangeQueueFromCloud(queueId) {
		this._notificationService
			.confirm(`Load <strong>${this.cloudQueue[queueId].description}</strong>?`)
			.afterClosed()
			.subscribe(async (confirm) => {
				if (!confirm) return;

				this.overwriteChangeQueueOnImport = true;
				this.changeQueueImport = this.cloudQueue[queueId].data;
				this.importChangeQueue();
			});
	}

	saveChangeQueueToCloud() {
		let description = prompt('Enter Queue Description', '');

		if (!description) return;

		this.isFirestoring = true;

		this._notificationService
			.confirm('Save this queue to the Cloud?')
			.afterClosed()
			.subscribe(async (confirm) => {
				if (!confirm) return;

				const firestore = firebase.firestore();

				try {
					let ref = await firestore
						.collection('Users')
						.doc(this.uid)
						.collection('Queues')
						.add({
							description: description,
							data: this._dataService.encrypt(JSON.stringify(this.changeQueue)),
							_createdAt: new Date(),
						});

					//Added to the current cloud queue
					this.cloudQueue[ref.id] = {
						description: description,
						data: this._dataService.encrypt(JSON.stringify(this.changeQueue)),
						_createdAt: new Date(),
					};

					this._notificationService.alert('Queue item saved successfully.');

					this.isFirestoring = false;
				} catch (error) {
					this._notificationService.error(error);
					this.isFirestoring = false;
				}
			});
	}

	deleteChangeQueueFromCloud(queueId) {
		this._notificationService
			.confirm(`Delete <strong>${this.cloudQueue[queueId].description}</strong>?`)
			.afterClosed()
			.subscribe(async (confirm) => {
				if (!confirm) return;

				this.isFirestoring = true;

				try {
					const firestore = firebase.firestore();

					await firestore.collection('Users').doc(this.uid).collection('Queues').doc(queueId).delete();

					delete this.cloudQueue[queueId];
					this.isFirestoring = false;
				} catch (error) {
					this._notificationService.error(error);
					this.isFirestoring = false;
				}
			});
	}
}
