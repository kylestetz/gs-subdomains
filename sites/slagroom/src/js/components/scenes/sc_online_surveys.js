const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'How frequently do you take online surveys?',
	madPrompt: 'It is absolutely essential you answer the question. :( please tell me. How frequently do you take online surveys?',
	render(data) {
		return h('.scene.scene__online_surveys', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('onlinesurveys', 'allthetime', 'All of the time, I love it!', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('onlinesurveys', 'firstone', 'This is my first one', this.setAnswerFromEvent.bind(this)),
					]),
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (!this.answer) {
			this.getMad();
		} else {
			dispatch.push(Actions.setAnswer({ gender: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});