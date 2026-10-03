const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	started(data) {
		this.targetPrompt= `Our features: ${data.answers.best_prices_on}: †®˚`;
		this.madPrompt = `Our features: ${data.answers.best_prices_on}ºª¨∑˙ƒ: †®˚ ${data.answers.mariah}`;
	},
	render(data) {
		return h('.scene.scene__our_features', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('boat', 'Little of blentz that.', 'Little of blentz that.', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('boat', 'Most part in full length upon its mate.', 'Most part in full length upon its mate.', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ our_features: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});