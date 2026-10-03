const Scene = require('./Scene');
const utils = require('../../utils');

let colors = [
	'red',
	'orange',
	'green',
	'blue',
	'purple'
];

function shuffle_colors() {
	// colors = _.shuffle(colors);
	dispatch.push(Actions.flash());
}

module.exports = new Scene({
	prompt: 'Got it! Now what is your favorite color?',
	madPrompt: 'It is absolutely essential you answer the question. What is your favorite color?',
	render(data) {
		return h('.scene.scene__favorite_color', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('radiogroup', [
						utils.forms.radio('favorite_color', 'Red', 'Red', (e) => {
							this.setAnswerFromEvent(e);
							shuffle_colors();
						}, {
							// className: colors[0]
						}),
						utils.forms.radio('favorite_color', 'Orange', 'Orange', (e) => {
							this.setAnswerFromEvent(e);
							shuffle_colors();
						}, {
							// className: colors[1]
						}),
						utils.forms.radio('favorite_color', 'Green', 'Green', (e) => {
							this.setAnswerFromEvent(e);
							shuffle_colors();
						}, {
							// className: colors[3]
						}),
						utils.forms.radio('favorite_color', 'Blue', 'Blue', (e) => {
							this.setAnswerFromEvent(e);
							shuffle_colors();
						}, {
							// className: colors[4]
						}),
						utils.forms.radio('favorite_color', 'Purple', 'Purple', (e) => {
							this.setAnswerFromEvent(e);
							shuffle_colors();
						}, {
							// className: colors[5]
						}),
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
			dispatch.push(Actions.setAnswer({ color: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});