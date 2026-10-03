const Scene = require('./Scene');
const utils = require('../../utils');

let disappeared = false;
let glitch = false;

// todo: do some glitches on this one

module.exports = new Scene({
	prompt: 'Did you know you could Enhance your existing dental insurance with dental savings plans ?',
	started(data) {
		// wait a sec then destroy answer #2
		Promise.resolve()
		.then(() => utils.delay(2000))
		.then(() => {
			glitch = true;
			dispatch.push(Actions.flash());
		})
		.then(() => utils.delay(250))
		.then(() => {
			if (disappeared) return;
			disappeared = true;
			dispatch.push(Actions.flash());
		});
	},
	render(data) {
		return h('.scene.scene__enhance_dental', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('enhance_dental', 'yes', 'Lock In Today!', this.setAnswerFromEvent.bind(this)),
						disappeared ? [] : utils.forms.radio('enhance_dental', 'no', 'no thanks I don/t want these savings.', this.setAnswerFromEvent.bind(this), {
							className: glitch ? 'glitch' : ''
						}),
					]),
					h('button', {
						onclick: this.next.bind(this)
					}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'no') {
			disappeared = true;
			dispatch.push(Actions.flash());
		} else if (this.answer === 'yes') {
			dispatch.push(Actions.setAnswer({ enhance_dental: true }));
			dispatch.push(Actions.nextScene());
		}
	}
});