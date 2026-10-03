const Scene = require('./Scene');
const utils = require('../../utils');

let explain = false;

module.exports = new Scene({
	started(data) {
		this.targetPrompt = `was ${data.answers.teacher} a good teacher ?`;
		this.madPrompt = `did you find ${data.answers.teacher} attractive ?`;
	},
	render(data) {
		return h('.scene.scene__a_good_teacher', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					explain ? [] : h('radiogroup', [
						utils.forms.radio('a_good_teacher', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('a_good_teacher', 'no', 'no', this.setAnswerFromEvent.bind(this)),
					]),
					explain ? h('radiogroup', [
						utils.forms.radio('attractive', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('attractive', 'no', 'no', this.setAnswerFromEvent.bind(this)),
					]) : [],
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'no' && !explain) {
			dispatch.push(Actions.setAnswer({ a_good_teacher: false }));
			dispatch.push(Actions.nextScene());
		} else if (this.answer === 'yes' && !explain) {
			explain = true;
			this.getMad();
		} else {
			dispatch.push(Actions.setAnswer({ a_good_teacher: true, attractive: this.answer === 'yes' }));
			dispatch.push(Actions.nextScene());
		}
	}
});