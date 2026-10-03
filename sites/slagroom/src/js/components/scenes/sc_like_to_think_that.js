const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'yea, I think we\'d all like to think that',
	render(data) {
		return h('.scene.scene__like_to_think_that', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		dispatch.push(Actions.setAnswer({ like_to_think_that: true }));
		dispatch.push(Actions.nextScene());
	}
});