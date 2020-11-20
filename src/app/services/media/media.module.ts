import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MediaService } from './media.service';
import { MediaComponent } from './media.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		MatButtonModule,
		MatDialogModule,
		MatTabsModule,
		MatProgressBarModule,
		MatIconModule,
	],
	providers: [MediaService],
	declarations: [MediaComponent],
	exports: [MediaComponent],
	entryComponents: [MediaComponent],
})
export class MediaModule {}
