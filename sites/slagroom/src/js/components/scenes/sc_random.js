const Scene = require('./Scene');
const utils = require('../../utils');

let button_text = utils.single_mess();

module.exports = new Scene({
	started(data) {
		this.targetPrompt= utils.mess();
		this.madPrompt = utils.mess();
	},
	render(data) {
		return h('.scene.scene__random', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('button', {
						onclick: this.next.bind(this)
					}, [button_text])
			]) : []
		));
	},
	next() {
		button_text = utils.single_mess();
		this.madPrompt = utils.mess();
		this.getMad();
	}
});