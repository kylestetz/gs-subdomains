const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'Best Prices On:',
	started(data) {
		this.madPrompt = `Best Prices On ${data.answers.name} ${data.answers.sandwich} ${data.answers.teacher_obey}:`;
	},
	render(data) {
		return h('.scene.scene__best_prices_on', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('boat', 'beautiful creature', 'Very beautiful creature he wondered how far enough.', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('boat', 'swung the latter', 'Trust and swung the latter', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ best_prices_on: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});