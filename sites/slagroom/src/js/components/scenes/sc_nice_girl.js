const Scene = require('./Scene');
const utils = require('../../utils');

const labels = {
	bigmac: 'Big Mac',
	whoppler: 'Whoppler',
	beenncheddar: 'Been n Cheddar',
};

module.exports = new Scene({
	prompt: 'Woulͪd you mind to f͝inding a nice girl? :-)',
	started(data) {
		this.madPrompt = `Woulͪd you mind to f͝inding a nice girl? ##-x ${data.answers.teacher} true false false ${data.answers.soap} :-)`;
	},
	render(data) {
		return h('.scene.scene__nice_girl', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('boat', 'yes', 'Best Pricing in the Market.. FDA-Approved Meds..', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('boat', 'no', 't.onw/49nedgnio', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('boat', 'link', 'Copy and pa£ƒte th∑e li', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ boat: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});