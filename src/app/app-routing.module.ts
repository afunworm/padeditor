import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { AuthGuardService } from './auth-guard.service';
import { FirebaseUIComponent } from './firebaseui/firebaseui.component';

const routes: Routes = [
	{ path: '', component: EditorComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
	{ path: 'login', component: FirebaseUIComponent },
	{ path: 'fingerprint', component: FingerprintComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
