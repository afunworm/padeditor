import { SafeHtml } from '@angular/platform-browser';

interface NotificationButton {
	color?: 'primary' | 'accent' | 'warn' | 'default';
	text?: string;
	callback?: Function;
}

export interface NotificationInterface {
	/*
	 *-------------------------------------------------------
	 * Cancel button
	 *-------------------------------------------------------
	 * Configure the cancel button.
	 * Ignored if dialog's type is 'alert'
	 */
	cancelButton?: {
		color?: 'primary' | 'accent' | 'warn' | 'default';
		text?: string;
	};
	/*
	 *-------------------------------------------------------
	 * OK button
	 *-------------------------------------------------------
	 * Configure the cancel button.
	 * Ignored if dialog's type is 'alert'
	 */
	okButton?: {
		color?: 'primary' | 'accent' | 'warn' | 'default';
		text?: string;
	};
	/*
	 *-------------------------------------------------------
	 * Custom buttons
	 *-------------------------------------------------------
	 * Add buttons to dialog
	 */
	buttons?: NotificationButton[];
	/*
	 *-------------------------------------------------------
	 * Dialog message
	 *-------------------------------------------------------
	 * The message of the dialog
	 * Note that HTML can also be passed as well, which can be done by calling {@link DomSanitizer#bypassSecurityTrustHtml}
	 * @see https://angular.io/api/platform-browser/DomSanitizer#bypassSecurityTrustHtml
	 */
	message?: SafeHtml | string;
	/*
	 *-------------------------------------------------------
	 * Dialog title
	 *-------------------------------------------------------
	 * The title of the dialog
	 */
	title?: string;
	/*
	 *-------------------------------------------------------
	 * Dialog type
	 *-------------------------------------------------------
	 *
	 */
	type?: 'alert' | 'confirm';
}
