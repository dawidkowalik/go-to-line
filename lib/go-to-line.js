'use babel';

import { CompositeDisposable } from 'atom';

class OneTab {
	activate(state) {
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(atom.workspace.observePanes(pane => {
			this.initPane(pane);
		}));
	}

	deactivate() {
		this.subscriptions.dispose();
	}

	initPane(pane) {
		this.updateTabBarVisibility(pane);

		const subscription = new CompositeDisposable();
		subscription.add(pane.onDidDestroy(() => {
			subscription.dispose()
			this.subscriptions.remove(subscription)
		}));


		this.subscriptions.add(subscription)
	}

	updateTabBarVisibility(pane) {
		const paneView = atom.views.getView(pane);

		console.log(pane);
		console.log(paneView);
		console.log(paneView.querySelector('.tab-bar'));

		if (pane.activeItempane && pane.activeItempane.getItems().length > 0) {

		}
	}
}

export default new OneTab();
