const Scene = require('./Scene');
const utils = require('../../utils');

let explain = false;

module.exports = new Scene({
	prompt: 'are you happy ?',
	madPrompt: 'I’m sorry, please explain why not?',
	render(data) {
		return h('.scene.scene__are_you_happy', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					explain ? [] : h('radiogroup', [
						utils.forms.radio('happy', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('happy', 'no', 'no', this.setAnswerFromEvent.bind(this)),
					]),
					explain ? h('input', {
						attributes: {
							type: 'text',
							maxlength: 7
						},
						onkeyup: this.setAnswerFromEvent.bind(this)
					}) : [],
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'no' && !explain) {
			explain = true;
			this.getMad();
		} else if (this.answer) {
			dispatch.push(Actions.setAnswer({ happy: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});