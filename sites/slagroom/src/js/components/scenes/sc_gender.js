const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	started(data) {
		this.targetPrompt = `Interesting ${data.answers.name}! What is your gender?`;
		this.madPrompt = `Please be respectful ${data.answers.name}, what is your gender?`;
	},
	render(data) {
		return h('.scene.scene__gender', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('gender', 'allboy', 'all boy', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('gender', '/', '/', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('gender', 'allgirl', 'all girl', this.setAnswerFromEvent.bind(this)),
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