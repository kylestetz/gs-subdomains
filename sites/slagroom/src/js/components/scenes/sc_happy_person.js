const Scene = require('./Scene');
const utils = require('../../utils');

function triggerError() {
	$(`<div class="error">Oops, something went wrong! Please try again</div>`).appendTo('body');
	Promise.resolve()
	.then(() => utils.delay(2000))
	.then(() => $('.error').addClass('fade'))
	.then(() => utils.delay(1000))
	.then(() => $('.error').remove());
}

let redo = false;

module.exports = new Scene({
	prompt: 'Do you consider yourself to be a happy person?',
	render(data) {
		return h('.scene.scene__happy_person', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						redo ? [] : utils.forms.radio('happyperson', 'yes', 'yes', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('happyperson', 'no', 'no', this.setAnswerFromEvent.bind(this)),
					]),
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'yes' && !redo) {
			redo = true;
			this.prompt = 'Are you a happy person?';
			triggerError();
			dispatch.push(Actions.flash());
		} else if (redo || this.answer === 'no') {
			dispatch.push(Actions.setAnswer({ gender: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});