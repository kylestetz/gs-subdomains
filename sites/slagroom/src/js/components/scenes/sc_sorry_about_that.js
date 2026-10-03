const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'woops sorry abou t that ?',
	render(data) {
		return h('.scene.scene__online_surveys', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('button', {
					onclick: this.next.bind(this)
				}, ['cash $आप'])
			]) : []
		));
	},
	next() {
		dispatch.push(Actions.setAnswer({ hi: this.answer }));
		dispatch.push(Actions.nextScene());
	}
});