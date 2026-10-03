const utils = require('../../utils');

class Scene {
	constructor(options) {
		this.targetPrompt = options.prompt;
		this.prompt = '';
		this.madPrompt = options.madPrompt;
		this.weAreMad = false;
		this.showForm = false;
		this.fadeIn = false;
		this.render = options.render.bind(this);
		this.started = options.started ? options.started.bind(this) : $.noop;
		this.answer = '';
		this.next = options.next && options.next.bind(this);
		this._started = false;
	}

	start(data) {
		if (this._started) return;
		this._started = true;
		this.started(data);
		utils.animation.type(this.targetPrompt, this.appendPrompt.bind(this), this.turnOnTheForm.bind(this));
		window.pause_timer();
	}

	appendPrompt(word) {
		this.prompt += word;
		dispatch.push(Actions.flash());
	}

	turnOnTheForm() {
		this.showForm = true;
		_.delay(this.startFading.bind(this), 30);
		dispatch.push(Actions.flash());
		window.start_timer();
	}

	startFading() {
		this.fadeIn = true;
		dispatch.push(Actions.flash());
	}

	getMad() {
		if (!this.madPrompt) {
			dispatch.push(Actions.getMad(false));
			dispatch.push(Actions.nextScene());
			return;
		}
		this.weAreMad = true;
		this.showForm = false;
		this.fadeIn = false;
		this.prompt = '';
		utils.animation.type(this.madPrompt, this.appendPrompt.bind(this), this.turnOnTheForm.bind(this));
		window.pause_timer();
		dispatch.push(Actions.getMad(false));
	}

	setAnswerFromEvent(e) {
		this.answer = e.target.value;
	}
}

module.exports = Scene;