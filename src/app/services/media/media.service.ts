import { Injectable } from '@angular/core';
import { MediaComponent } from './media.component';
import { MediaInterface } from './media.interface';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { merge as _merge } from 'lodash';

@Injectable()
export class MediaService {
	constructor(private dialog: MatDialog) {}

	open(matDialogConfigs: MatDialogConfig<MediaInterface> = {}): MatDialogRef<MediaComponent, string> {
		//Setting defaults for matDialogConfigs
		let matDialogConfigDefault: MatDialogConfig = {
			width: '700px',
			position: {},
		};
		matDialogConfigs = _merge(matDialogConfigDefault, matDialogConfigs);

		return this.dialog.open<MediaComponent, MediaInterface, string>(MediaComponent, matDialogConfigs);
	}
}
