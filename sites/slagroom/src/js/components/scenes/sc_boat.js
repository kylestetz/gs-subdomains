const Scene = require('./Scene');
const utils = require('../../utils');

const labels = {
	bigmac: 'Big Mac',
	whoppler: 'Whoppler',
	beenncheddar: 'Been n Cheddar',
};

module.exports = new Scene({
	prompt: 'Do you have a boat?',
	started(data) {
		this.madPrompt = `${data.answers.name}, do you have a √b∂at??`;
	},
	render(data) {
		return h('.scene.scene__boat', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('boat', 'yes', 'Yes (Would you like to Sell Your Boat and keep 100 percent of what you sell it for?)', this.setAnswerFromEvent.bind(this)),
						utils.forms.radio('boat', 'no', 'No (Boats For Sale By Owners Net has some great new and used boats click here)', this.setAnswerFromEvent.bind(this)),
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
			dispatch.push(Actions.setAnswer({ boat: this.answer === 'yes' }));
			dispatch.push(Actions.nextScene());
		}
	}
});