const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'That\'s all for now. MEow',
	render(data) {
		return h('.scene.scene__end', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('button', ['meow'])
			]) : []
		));
	}
});