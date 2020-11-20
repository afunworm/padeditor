import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/storage';

export interface UploadedFileData {
	downloadUrl: string;
	path: string;
	fileId: string;
	name: string;
	size: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
	private _storage;
	private _uploadProgress = new BehaviorSubject<number>(0);
	private _folder = '';

	constructor() {}

	public get progress() {
		return this._uploadProgress;
	}

	private generateUniqueId(maxLength: number = 28) {
		let random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

		let acceptable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < maxLength; i++) {
			result += acceptable[random(0, acceptable.length - 1)];
		}

		return result;
	}

	setFolder(folderName: string) {
		this._folder = folderName;
		return this;
	}

	async upload(
		file: File,
		metadata: { [name: string]: string } = {},
		extensionEnforce: string[] | string | null = null,
		contentTypeEnforce: string[] | string | null = null
	): Promise<string | UploadedFileData> {
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop();
		const filePath = this._folder + '/' + +new Date() + '_' + fileName;
		const fileType = file.type; //image/png, etc
		const storage = firebase.storage();
		const fileRef = storage.ref().child(filePath);

		return new Promise((resolve, reject) => {
			//Extension enforce
			if (Array.isArray(extensionEnforce)) {
				if (!extensionEnforce.map((ext) => ext.replace('.', '')).includes(fileExtension))
					return reject('Invalid file type.');
			} else if (typeof extensionEnforce === 'string') {
				if (extensionEnforce.replace('.', '') !== fileExtension) return reject('Invalid file type.');
			}

			//Content-Type enforce
			if (Array.isArray(contentTypeEnforce)) {
				if (!contentTypeEnforce.includes(fileType)) return reject('Invalid content-type.');
			} else if (typeof contentTypeEnforce === 'string') {
				if (!fileType.startsWith(contentTypeEnforce)) return reject('Invalid content-type.');
			}

			//Create fileId if not exists
			if (!('fileId' in metadata)) metadata.fileId = this.generateUniqueId();

			//Integrate fileName to metadata
			if (!('name' in metadata)) metadata.name = fileName;

			//Restart upload progress
			this._uploadProgress.next(0);

			const task = fileRef.put(file, { customMetadata: metadata });

			task.on(
				'state_changed',
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					this._uploadProgress.next(progress);
				},
				(error) => {
					reject(error);
				},
				() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					task.snapshot.ref
						.getDownloadURL()
						.then((downloadURL) => {
							resolve({
								name: fileName,
								size: file.size,
								downloadUrl: downloadURL,
								path: filePath,
								fileId: metadata.fileId,
							});
						})
						.catch((error) => {
							reject(error);
						});
				}
			);
		});
	}

	deleteFile(filePath: string) {
		const storage = firebase.storage();

		return new Promise(async (resolve, reject) => {
			try {
				await storage.ref().child(filePath).delete();
				resolve(true);
			} catch (error) {
				reject(error.message);
			}
		});
	}
}
