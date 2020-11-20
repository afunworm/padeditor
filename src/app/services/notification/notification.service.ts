import { Injectable } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationInterface } from './notification.interface';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { merge as _merge } from 'lodash';
import { config } from 'firebase-functions';

@Injectable()
export class NotificationService {
	constructor(private dialog: MatDialog) {}

	open(
		type: 'alert' | 'confirm',
		configs: NotificationInterface | string,
		matDialogConfigs: MatDialogConfig<NotificationInterface> = {}
	): MatDialogRef<NotificationComponent, string> {
		//Setting defaults for matDialogConfigs
		let matDialogConfigDefault: MatDialogConfig = {
			width: '400px',
			position: {
				top: '15%',
			},
		};
		matDialogConfigs = _merge(matDialogConfigDefault, matDialogConfigs);

		//Setting defaults for configs
		let configDefault: NotificationInterface = {
			type: type,
			title: type === 'alert' ? 'Alert' : 'Confirmation',
			message: '',
			buttons: [],
		};

		//Run through custom buttons
		if (configs && typeof configs !== 'string' && configs.buttons) {
			configs.buttons.forEach((button) => {
				let buttonDefault = {
					color: 'default',
					text: '',
					callback: () => {},
				};
				button = _merge(buttonDefault, button);
				configDefault.buttons.push(button);
			});
		}

		//Add default buttons
		let dialogId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		//Confirmation has its own buttons by default
		if (type !== 'confirm') {
			configDefault.buttons.push({
				color: 'default',
				text: 'Done',
				callback: () => {
					let target = this.dialog.getDialogById(dialogId);
					target.close();
				},
			});
		}

		if (configs && typeof configs === 'string') {
			configs = _merge(configDefault, { message: configs });
		} else {
			configs = _merge(configDefault, configs);
		}

		matDialogConfigs.data = configs as NotificationInterface;
		matDialogConfigs.id = dialogId;

		return this.dialog.open<NotificationComponent, NotificationInterface, string>(
			NotificationComponent,
			matDialogConfigs
		);
	}

	alert(
		configs: NotificationInterface | string,
		matDialogConfigs: MatDialogConfig<NotificationInterface> = {}
	): MatDialogRef<NotificationComponent, string> {
		return this.open('alert', configs, matDialogConfigs);
	}

	error(
		message: string,
		matDialogConfigs: MatDialogConfig<NotificationInterface> = {}
	): MatDialogRef<NotificationComponent, string> {
		return this.open(
			'alert',
			{
				title: 'Error',
				message: message,
			},
			matDialogConfigs
		);
	}

	confirm(
		configs: NotificationInterface | string,
		matDialogConfigs: MatDialogConfig<NotificationInterface> = {}
	): MatDialogRef<NotificationComponent, string> {
		return this.open('confirm', configs, matDialogConfigs);
	}
}
