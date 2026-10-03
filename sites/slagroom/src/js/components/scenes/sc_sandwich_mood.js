const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	started(data) {
		this.targetPrompt = `mmm yummy. When you are eating ${data.answers.sandwich}s which of the following best describes your mood`;
		this.madPrompt = `${data.answers.name} it feels like we're getting to the root of things now. Please, when you are eating ${data.answers.sandwich}s which of the following best describes your mood`;
	},
	render(data) {
		return h('.scene.scene__sandwich_mood', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('sandwich_mood', 'chipper', 'chipper', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich_mood', 'satisfied', 'satisfied', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich_mood', 'deeply deeply sad and regretful', 'deeply deeply sad and regretful', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich_mood', 'pleasant', 'pleasant', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ sandwich_mood: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});