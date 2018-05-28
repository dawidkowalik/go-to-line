'use babel';

import { CompositeDisposable, Point } from 'atom';

export default {
	activate(state) {
		console.log("activate")
		this.subscriptions = new CompositeDisposable();
		this.subscriptions.add(
			atom.workspace.observeTextEditors(pane =>
				this.generateInput(pane)
			)
		);
		this.subscriptions.add(
			atom.workspace.observeTextEditors(editor => {
				editor.onDidChange(change =>
					this.updateInput(editor)
				)
				editor.onDidChangeCursorPosition(change => {
					this.updateInput(editor)
				})
			})
		);
	},

	generateInput(pane) {
		var that = this;
		const paneView = atom.views.getView(pane);
		const gutter = paneView.querySelector('.gutter-container');
		that.handleInput(gutter, pane)

		const subscription = new CompositeDisposable();
		subscription.add(pane.onDidDestroy(() => {
			subscription.dispose()
			this.subscriptions.remove(subscription)
		}));

		this.subscriptions.add(subscription)
	},


	handleInput(gutter, pane) {
		that = this;
		console.log(pane)
		lineField = gutter.querySelector('.go-to-line-field');
		lineCount = pane.getLineCount();
		cursorPosition = pane.getCursorBufferPosition();
		console.log(cursorPosition);
		if (lineField) {
			var lineFieldInput = lineField.querySelector('input');
			lineFieldInput.value = cursorPosition.row + 1;
			lineFieldInput.max = lineCount;
		} else {
			elWrap = document.createElement('div');
			elInput = document.createElement('input');
			elInput.addEventListener('keyup', function () {
				row = this.value;
				console.log(this.value);
				console.log(cursorPosition.row);
				pane.setCursorBufferPosition(new Point(parseInt(row), 0))
			});
			elInput.addEventListener("mousewheel", function(){
				this.blur()
			})
			elInput.type = 'number';
			elInput.value = cursorPosition.row + 1;
			elInput.min = 1;
			elInput.max = lineCount;
			elWrap.classList.add('go-to-line-field');
			elWrap.classList.add('line-number');
			elWrap.appendChild(elInput);
			gutter.insertBefore(elWrap, gutter.firstChild);
		}
	},

	updateInput(editor) {
		this.handleInput(editor.lineNumberGutter.element.parentNode.parentNode, atom.workspace.getActivePane().activeItem);
	}
}
