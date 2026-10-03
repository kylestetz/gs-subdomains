const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	// reponse to sc_adult_obey
	prompt: 'good. please click ••the buttºn bel¢w',
	render(data) {
		return h('.scene.scene__click_the_button', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('img', {
						attributes: {
							src: `/images/${data.answers.mariah}.jpg`,
							width: 220,
							height: 220,
						},
						style: {
							cursor: 'pointer'
						},
						onclick: this.next.bind(this)
					})
			]) : []
		));
	},
	next() {
		dispatch.push(Actions.setAnswer({ horse: true }));
		dispatch.push(Actions.nextScene());
	}
});