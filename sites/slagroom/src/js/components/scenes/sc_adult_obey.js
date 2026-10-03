const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'but do you obey them now?',
	started(data) {
		this.madPrompt = `how would ${data.answers.teacher} feel about that?`;
	},
	render(data) {
		return h('.scene.scene__adult_obey', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [].concat(
					!this.weAreMad ? [
						// first question
						h('radiogroup', [
							utils.forms.radio('adult_obey', 'of course', 'of course', this.setAnswerFromEvent.bind(this)),
							utils.forms.radio('adult_obey', 'no', 'no', this.setAnswerFromEvent.bind(this)),
						]),
						h('button', {
							onclick: this.next.bind(this)
						}, ['ok'])
					] : [
						// second question
						h('input', {
							attributes: {
								type: 'text'
							},
							onkeyup: this.setAnswerFromEvent.bind(this)
						}),
						h('button', {
							onclick: this.next.bind(this)
						}, ['ok'])
					]
			)) : []
		));
	},
	next() {
		if (!this.answer) return;
		if (!this.weAreMad && this.answer === 'no') {
			this.getMad();
		} else if (this.weAreMad && this.answer) {
			dispatch.push(Actions.setAnswer({ adult_obey: 'no', teacher_obey: this.answer }));
			dispatch.push(Actions.nextScene());
		} else if (!this.weAreMad && this.answer) {
			dispatch.push(Actions.setAnswer({ adult_obey: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});