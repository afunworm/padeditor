import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationInterface } from './notification.interface';
import { merge as _merge } from 'lodash';

@Component({
	selector: 'notification',
	templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
	//Configs has already been taken care of by the service
	constructor(@Inject(MAT_DIALOG_DATA) public configs: NotificationInterface) {}

	ngOnInit() {}

	runCallBack(callback?: Function) {
		if (!callback || typeof callback !== 'function') {
			return;
		}

		callback.call(null);
	}

	/**
	 * Checks if the dialog message is HTML
	 */
	// get isDialogMsgHtml(): boolean {
	// console.log(typeof this.config.body);
	// return typeof this.config.body === 'object';
	// }
}
