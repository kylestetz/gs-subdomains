const Scene = require('./Scene');
const utils = require('../../utils');

const labels = {
	bigmac: 'Big Mac',
	whoppler: 'Whoppler',
	beenncheddar: 'Been n Cheddar',
};

module.exports = new Scene({
	prompt: 'Do you know if you’re getting the best deal on dental insurance?',
	started(data) {
		this.madPrompt = `${data.answers.name}, it is absolutely essential you answer the question. Do you know if you’re getting the best deal on dental insurance ?`;
	},
	render(data) {
		return h('.scene.scene__dental_insurance', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('dental_insurance', 'yes', 'yes, at least i think so', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('dental_insurance', 'no', 'no', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ dental_insurance: this.answer === 'yes' }));
			dispatch.push(Actions.nextScene());
		}
	}
});