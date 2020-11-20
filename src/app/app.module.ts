import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from './app-material.module';
import { LoadingComponent } from './services/loading/loading.component';
import { IfPageLoadedDirective } from './directives/if-page-loaded.directive';
import { InputDirective } from './directives/input.directive';
import { LOCALE_ID } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthGuardService } from './auth-guard.service';
import { NotificationComponent } from './services/notification/notification.component';
import { NotificationModule } from './services/notification/notification.module';
import { EditorComponent } from './editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { FirebaseUIComponent } from './firebaseui/firebaseui.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import firebase from 'firebase/app';
import 'firebase/analytics';

var firebaseConfig = {
	apiKey: 'AIzaSyAWUZHmaQqsF1q8d3Eh1CXSDXZJaUCEmas',
	authDomain: 'paddata-dda55.firebaseapp.com',
	databaseURL: 'https://paddata-dda55.firebaseio.com',
	projectId: 'paddata-dda55',
	storageBucket: 'paddata-dda55.appspot.com',
	messagingSenderId: '933475588044',
	appId: '1:933475588044:web:2dd7999bc32fb75174ef69',
	measurementId: 'G-BJYE8GJ89H',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

@NgModule({
	declarations: [
		AppComponent,
		LoadingComponent,
		IfPageLoadedDirective,
		InputDirective,
		EditorComponent,
		FingerprintComponent,
		FirebaseUIComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AppMaterialModule,
		NotificationModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
	],
	providers: [
		AuthGuardService,
		{
			provide: LOCALE_ID,
			useValue: 'en-US',
		},
		CurrencyPipe,
	],
	entryComponents: [NotificationComponent],
	bootstrap: [AppComponent],
})
export class AppModule {}
