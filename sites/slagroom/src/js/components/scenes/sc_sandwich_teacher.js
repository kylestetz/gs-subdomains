const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	started(data) {
		this.targetPrompt = `Tell me ${data.answers.name}, when you are feeling ${data.answers.sandwich_mood} while eating your ${data.answers.sandwich} do you think about ${data.answers.teacher}?`;
		this.madPrompt = `Please ${data.answers.name}, this is essential. When you are feeling ${data.answers.sandwich_mood} while eating your ${data.answers.sandwich}, you think about ${data.answers.teacher}, correct?`;
	},
	render(data) {
		return h('.scene.scene__sandwich_teacher', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('sandwich_teacher', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('sandwich_teacher', 'no', 'no', this.setAnswerFromEvent.bind(this)),
					]),
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (!this.answer && !this.weAreMad) {
			this.getMad();
		} else if (this.answer) {
			dispatch.push(Actions.setAnswer({ sandwich_teacher: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});