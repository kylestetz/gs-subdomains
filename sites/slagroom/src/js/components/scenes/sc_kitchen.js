const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'Take a moment to think about your kitchen',
	render(data) {
		return h('.scene.scene__kitchen', [
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
		dispatch.push(Actions.nextScene());
	}
});