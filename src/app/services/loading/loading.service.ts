import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
	private _isLoading = {
		dialog: new BehaviorSubject<boolean>(false),
		bar: new BehaviorSubject<boolean>(false),
	};
	private _title = new BehaviorSubject<string>('Please Wait');
	private _message = new BehaviorSubject<string>('Loading data from the server...');
	private _mode = new BehaviorSubject<'determinate' | 'indeterminate' | 'buffer' | 'query'>('indeterminate');
	private _color = new BehaviorSubject<'default' | 'primary' | 'accent' | 'warn'>('accent');
	private _value = new BehaviorSubject<number>(0);
	private _isPageLoading = new BehaviorSubject<boolean>(false);

	status(type: 'dialog' | 'bar' = 'dialog') {
		return this._isLoading[type];
	}

	get isPageLoading() {
		return this._isPageLoading;
	}

	pageLoaded(hideProgress: boolean = true) {
		//The page is being loaded
		//This can be used by other components to see if the page is in the 'loading' status
		this._isPageLoading.next(false);

		//Hide the progressBar
		if (hideProgress) this.hide();
	}

	pageLoading(displayProgress: false | 'bar' | 'dialog' = 'bar') {
		//The page is being loaded
		//This can be used by other components to see if the page is in the 'loading' status
		this._isPageLoading.next(true);

		//Do we display the progress bar?
		if (displayProgress === false) this.hide();
		else this.show(displayProgress);
	}

	get title() {
		return this._title;
	}

	get message() {
		return this._message;
	}

	get mode() {
		return this._mode;
	}

	get color() {
		return this._color;
	}

	get value() {
		return this._value;
	}

	show(type: 'dialog' | 'bar' = 'dialog') {
		//Only 1 type of progress bar can be shown at a time
		if (type === 'dialog') {
			this._isLoading.dialog.next(true);
			this._isLoading.bar.next(false);
		} else if (type === 'bar') {
			this._isLoading.bar.next(true);
			this._isLoading.dialog.next(false);
		}
	}

	hide() {
		this._isLoading.dialog.next(false);
		this._isLoading.bar.next(false);
	}

	set(
		optionName: 'title' | 'message' | 'mode' | 'color' | 'value' | 'isPageLoading',
		value: string | number | boolean
	) {
		//Do not overwrite on undefined value, let the default value of BehaviorSubject take care of it
		if (value === undefined) return;

		if (optionName === 'title') this._title.next(value as string);
		if (optionName === 'message') this._message.next(value as string);
		if (optionName === 'mode') this._mode.next(value as 'determinate' | 'indeterminate' | 'buffer' | 'query');
		if (optionName === 'color') this._color.next(value as 'default' | 'primary' | 'accent' | 'warn');
		if (optionName === 'value') this._value.next(value as number);
		if (optionName === 'isPageLoading') this._isPageLoading.next(value as boolean);
	}
}
