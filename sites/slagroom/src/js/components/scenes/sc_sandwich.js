const Scene = require('./Scene');
const utils = require('../../utils');

const labels = {
	bigmac: 'Big Mac',
	whoppler: 'Whoppler',
	beenncheddar: 'Been n Cheddar',
};

module.exports = new Scene({
	prompt: 'in your view which sandwich is better?',
	started(data) {
		this.madPrompt = `${data.answers.name}, it is absolutely essential you answer the question. Which sandwich is better?`;
	},
	render(data) {
		return h('.scene.scene__sandwich', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('sandwich', 'bigmac', labels.bigmac, this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich', 'whoppler', labels.whoppler, this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich', 'beenncheddar', labels.beenncheddar, this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich', 'other', 'Other', this.setAnswerFromEvent.bind(this), {
							disabled: true
						}),
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
			dispatch.push(Actions.setAnswer({ sandwich: labels[this.answer] }));
			dispatch.push(Actions.nextScene());
		}
	}
});