class BrowserHistory {
	private history;
	private currIndex;

	constructor() {
		this.history = [];
		this.currIndex = -1;
	}

	showPage(page) {}

	goBack() {
		if (this.currIndex > 0) {
			this.currIndex--;
			const page = this.history[this.currIndex];
			showPage(page);
		}
	}

	goForward() {
		if (this.currIndex < this.history.length - 1) {
			this.currIndex++;
			const page = this.history[this.currIndex];
			showPage(page);
		}
	}

	navigate(page) {
		this.currIndex++;
		this.history.splice(currIndex);
		this.history.push(page);
		showPage(page);
	}
}