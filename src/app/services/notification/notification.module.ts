import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';

@NgModule({
	imports: [BrowserModule, CommonModule, MatButtonModule, MatDialogModule],
	providers: [NotificationService],
	declarations: [NotificationComponent],
	exports: [NotificationComponent],
	entryComponents: [NotificationComponent],
})
export class NotificationModule {}
