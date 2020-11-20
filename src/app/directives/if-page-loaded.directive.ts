import { Directive, TemplateRef, ViewContainerRef, OnInit, Input, OnDestroy } from '@angular/core';
import { LoadingService } from '../services/loading/loading.service';
import { Subscription } from 'rxjs';

@Directive({
	selector: '[ifPageLoaded]',
})
export class IfPageLoadedDirective implements OnInit, OnDestroy {
	@Input('ifPageLoaded') condition = true;
	private _loadingSubscription: Subscription;

	constructor(
		private _loadingService: LoadingService,
		private _templateRef: TemplateRef<any>,
		private _viewContainerRef: ViewContainerRef
	) {}

	ngOnInit(): void {
		//Clear the view while the page is loading
		this._viewContainerRef.clear();

		this._loadingSubscription = this._loadingService.isPageLoading.subscribe((loading) => {
			//Clear the content everytime loading is emitted
			this._viewContainerRef.clear();

			//If loading is done and the condition is met
			if (!loading && !!this.condition) {
				//Create view
				this._viewContainerRef.createEmbeddedView(this._templateRef);
			}
		});
	}

	ngOnDestroy(): void {
		//Clean up
		this._viewContainerRef.clear();
		this._loadingSubscription.unsubscribe();
	}
}
