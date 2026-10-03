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
	prompt: 'How are you enjoying this survey so far?',
	render(data) {
		return h('.scene.scene__enjoying', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('enjoying', 'yes', 'it\'s terrific', this.setAnswerFromEvent.bind(this)),
						redo ? [] : utils.forms.radio('enjoying', 'no', 'i don\'t like it', this.setAnswerFromEvent.bind(this)),
					]),
					h('button', {
						onclick: this.next.bind(this)
					}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'no' && !redo) {
			redo = true;
			triggerError();
			dispatch.push(Actions.flash());
		} else if (redo || this.answer === 'yes') {
			dispatch.push(Actions.setAnswer({ enjoying: true }));
			dispatch.push(Actions.nextScene());
		}
	}
});