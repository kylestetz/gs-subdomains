const Scene = require('./Scene');
const utils = require('../../utils');

let disappeared = false;
let glitch = false;

module.exports = new Scene({
	prompt: 'Hi आपß˙त¨∆ how are you ??',
	started(data) {
		// wait a sec then destroy answer #1
		Promise.resolve()
		.then(() => utils.delay(3000))
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
		return h('.scene.scene__online_surveys', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						disappeared ? [] : utils.forms.radio('hi', 'xxx', 'For security purposes what was the na', this.setAnswerFromEvent.bind(this), {
							className: glitch ? 'glitch' : ''
						}),
						utils.forms.radio('hi', 'yes', 'Challenge Complete होते ही आपके Champcash Wallet मे $1 की Income आप देख सकोगे.', this.setAnswerFromEvent.bind(this)),
					]),
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		if (this.answer === 'xxx') {
			disappeared = true;
			dispatch.push(Actions.flash());
		} else if (this.answer === 'yes') {
			dispatch.push(Actions.setAnswer({ hi: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});