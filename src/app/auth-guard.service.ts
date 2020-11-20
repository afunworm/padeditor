import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading/loading.service';
import firebase from 'firebase/app';
import 'firebase/remote-config';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _loadingService: LoadingService
	) {}

	canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		this._loadingService.pageLoading();

		return new Promise(async (resolve) => {
			//Check if user is authorized
			const remoteConfig = firebase.remoteConfig();
			remoteConfig.settings = {
				minimumFetchIntervalMillis: 10000,
				fetchTimeoutMillis: 60000,
			};
			await remoteConfig.fetchAndActivate();
			let fingerprints = JSON.parse(remoteConfig.getValue('authorized').asString());

			const auth = firebase.auth();

			auth.onAuthStateChanged((user) => {
				if (user && fingerprints.includes(user.uid)) {
					return resolve(true);
				} else {
					return resolve(
						this._router.createUrlTree(['/login'], {
							relativeTo: this._activatedRoute,
						})
					);
				}
			});
		});
	}
}
