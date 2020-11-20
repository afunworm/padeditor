import { Component, OnInit } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { LoadingService } from '../services/loading/loading.service';
import firebase from 'firebase/app';
import 'firebase/remote-config';

@Component({
	selector: 'app-fingerprint',
	templateUrl: './fingerprint.component.html',
	styleUrls: ['./fingerprint.component.scss'],
})
export class FingerprintComponent implements OnInit {
	uid;
	title;

	constructor(private _loadingService: LoadingService) {}

	async ngOnInit() {
		// We recommend to call `load` at application startup.
		const fpjs = await FingerprintJS.load();

		// The FingerprintJS agent is ready.
		// Get a visitor identifier when you'd like to.
		const result = await fpjs.get();

		// This is the visitor identifier:
		this.uid = result.visitorId;

		//Check if user is authorized
		const remoteConfig = firebase.remoteConfig();
		remoteConfig.settings = {
			minimumFetchIntervalMillis: 10000,
			fetchTimeoutMillis: 60000,
		};
		await remoteConfig.fetchAndActivate();
		let fingerprints = JSON.parse(remoteConfig.getValue('fingerprints').asString());
		if (Object.keys(fingerprints).includes(this.uid)) {
			this.title = 'You Are Authorized. Click <a href="/">here</a> to start.';
		} else {
			this.title = 'Unauthorized Access';
		}

		this._loadingService.pageLoaded();
	}
}
