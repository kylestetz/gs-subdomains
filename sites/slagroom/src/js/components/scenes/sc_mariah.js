const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'What was Mariah’s best album?',
	madPrompt: 'Please be respectful, what was Mariah’s best album?',
	render(data) {
		return h('.scene.scene__mariah', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('mariah', 'self-titled', 'self-titled', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('mariah', 'music-box', 'music box', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('mariah', 'daydream', 'daydream', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('mariah', 'butterfly', 'butterfly', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('mariah', 'e=mc2', 'e=mc2', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ mariah: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});