const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	// response to sc_mariah
	prompt: 'yea, I liked that one too. As a child did you usually obey the rules?',
	madPrompt: 'Sorry, didn\'t catch that— as a child did you usually obey the rules?',
	render(data) {
		return h('.scene.scene__child_obey', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('child_obey', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('child_obey', 'no', 'no', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('child_obey', 'rules were made to be broken', 'rules were made to be broken', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ child_obey: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});