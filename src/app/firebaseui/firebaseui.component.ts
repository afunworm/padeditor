import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../services/loading/loading.service';

import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebase/auth';

@Component({
	selector: 'firebaseui',
	templateUrl: './firebaseui.component.html',
	styleUrls: ['./firebaseui.component.css'],
	encapsulation: ViewEncapsulation.None,
})
export class FirebaseUIComponent implements OnInit {
	private _firebaseUIInitialized: boolean = false;

	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _loadingService: LoadingService
	) {}

	async ngOnInit() {
		this._loadingService.pageLoading();

		const auth = firebase.auth();
		//Check if user is authorized
		const remoteConfig = firebase.remoteConfig();
		remoteConfig.settings = {
			minimumFetchIntervalMillis: 10000,
			fetchTimeoutMillis: 60000,
		};
		await remoteConfig.fetchAndActivate();
		let fingerprints = JSON.parse(remoteConfig.getValue('authorized').asString());

		auth.onAuthStateChanged((user) => {
			if (user && fingerprints.includes(user.uid)) {
				this._router.navigate(['../'], { relativeTo: this._activatedRoute });
			} else if (user && !fingerprints.includes(user.uid)) {
				this._router.navigate(['../fingerprint'], { relativeTo: this._activatedRoute });
			} else {
				this._loadingService.pageLoaded();
				this.initFirebaseUI();
			}
		});
	}

	initFirebaseUI(): void {
		const auth = firebase.auth();

		let uiConfig = {
			callbacks: {
				signInSuccessWithAuthResult: (authResult, redirectUrl) => {
					return false;
				},
			},
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				// firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				// firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				// firebase.auth.GithubAuthProvider.PROVIDER_ID,
				// firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.PhoneAuthProvider.PROVIDER_ID,
				// firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
			],
			// tosUrl and privacyPolicyUrl accept either url string or a callback
			// function.
			// Terms of service url/callback.
			tosUrl: 'https://byh.uy/',
			// Privacy policy url/callback.
			privacyPolicyUrl: function () {
				window.location.assign('https://byh.uy/');
			},
		};

		//Do not initialize more than once
		if (this._firebaseUIInitialized) return;

		auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
			// Initialize the FirebaseUI Widget using Firebase.
			let ui = new firebaseui.auth.AuthUI(auth);

			// The start method will wait until the DOM is loaded.
			ui.start('#firebaseui-auth-container', uiConfig);

			//Note that this has been initialized
			this._firebaseUIInitialized = true;
		});
	}
}
