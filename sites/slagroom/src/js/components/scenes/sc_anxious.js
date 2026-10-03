const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'Our high speed movement trackers have noticed that you are moving through this survey faster than average. Are you feeling anxious?',
	madPrompt: 'It’s important to breathe, and relax.',
	render(data) {
		return h('.scene.scene__anxious', [
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
							utils.forms.radio('anxious', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
							utils.forms.radio('anxious', 'no', 'no', this.setAnswerFromEvent.bind(this)),
						]),
						h('button', {
							onclick: this.next.bind(this)
						}, ['ok'])
					] : [
						// second question
						h('button', {
							onclick: this.next.bind(this)
						}, ['ok'])
					]
			)) : []
		));
	},
	next() {
		if (!this.answer) return;
		if (!this.weAreMad && this.answer === 'yes') {
			dispatch.push(Actions.setAnswer({ anxious: true }));
			this.getMad();
		} else if (!this.weAreMad && this.answer == 'no') {
			dispatch.push(Actions.setAnswer({ anxious: false }));
			dispatch.push(Actions.nextScene());
		} else {
			dispatch.push(Actions.nextScene());
		}
	}
});