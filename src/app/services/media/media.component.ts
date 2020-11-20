import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaInterface } from './media.interface';
import { StorageService, UploadedFileData } from '../storage/storage.service';
import { NotificationService } from '../notification/notification.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

interface Uploaded {
	name: string;
	downloadUrl: string;
}

@Component({
	selector: 'media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class MediaComponent implements OnInit {
	uploadProgress: number = 0;
	uploaded: Uploaded[] = [];
	library: any[] = [];
	fileName: string = '';
	isUploading: boolean = false;
	isDeleting: boolean = false;
	currentFile;
	@ViewChild('file') file: ElementRef<HTMLElement>;

	//Configs has already been taken care of by the service
	constructor(
		@Inject(MAT_DIALOG_DATA) public configs: MediaInterface,
		private _storageService: StorageService,
		private _notificationService: NotificationService
	) {}

	formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	async ngOnInit() {
		/* Fetch media */
		const firestore = firebase.firestore();

		try {
			let snapshot = await firestore.collection('Storage').orderBy('_createdAt', 'desc').limit(50).get();

			let counter = 0;
			snapshot.forEach((file) => {
				let data = file.data();
				this.library.push({
					fileId: data.fileId,
					downloadUrl: data.downloadUrl,
					name: data.name,
					path: data.path,
					size: this.formatBytes(data.size),
				});

				if (counter === 0) {
					this.currentFile = {
						fileId: data.fileId,
						downloadUrl: data.downloadUrl,
						name: data.name,
						path: data.path,
						size: this.formatBytes(data.size),
					};
				}
				counter++;
			});
		} catch (error) {
			this._notificationService.error(error.message);
		}
	}

	openFileSelection() {
		this.file.nativeElement.click();
	}

	onFileSelected($event) {
		const file = $event.target.files[0];
		if (!file) return;

		let currentIndex = this.uploaded.length;

		//Assign name & monitor progress
		this.fileName = file.name;
		this._storageService.progress.subscribe((progress) => {
			this.uploadProgress = Number(progress.toFixed(2));
		});

		//Upload file
		this.isUploading = true;
		this._storageService
			.setFolder('default')
			.upload(file, {}, ['.jpg', '.jpeg', '.png'])
			.then((result) => {
				//Update uploaded list
				this.uploaded[currentIndex] = {} as Uploaded;
				this.uploaded[currentIndex].name = file.name;
				this.uploaded[currentIndex].downloadUrl = (result as UploadedFileData).downloadUrl;

				//Load data to library
				let uploadedFileData = {
					fileId: (result as UploadedFileData).fileId,
					downloadUrl: (result as UploadedFileData).downloadUrl,
					name: (result as UploadedFileData).name,
					path: (result as UploadedFileData).path,
					size: this.formatBytes((result as UploadedFileData).size),
				};
				this.library.reverse();
				this.library.push(uploadedFileData);
				this.library.reverse();
				this.currentFile = uploadedFileData;

				this.isUploading = false;
			})
			.catch((error) => {
				console.log(error);
				this._notificationService.error(error);
				this.isUploading = false;
			});
	}

	setCurrentFile(fileData) {
		this.currentFile = fileData;
	}

	deleteFile(filePath: string) {
		this._notificationService
			.confirm('You are about to delete a file. This cannot be undone. Do you wish to continue?')
			.afterClosed()
			.subscribe(async (yes) => {
				if (!yes) return;

				this.isDeleting = true;
				try {
					await this._storageService.deleteFile(filePath);
					this._notificationService.alert('File removed successfully.');

					//Look for index of the deleted file
					let index = this.library.findIndex((item) => item.path === filePath);

					//Remove it
					if (index > -1) this.library.splice(index, 1);

					//Check if the library is empty
					if (!this.library.length) this.currentFile = null;

					this.isDeleting = false;
				} catch (error) {
					this._notificationService.error(error);
					this.isDeleting = false;
				}
			});
	}
}
