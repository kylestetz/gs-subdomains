const Scene = require('./Scene');
const utils = require('../../utils');

module.exports = new Scene({
	prompt: 'Read what these customers had to say about Sixth Generation Natural Dish Liquid',
	started(data) {
		$('body').css('background-color', data.answers.color);
	},
	render(data) {
		return h('.scene.scene__soap_reviews', [
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
		dispatch.push(Actions.setAnswer({ soap_reviews: true }));
		dispatch.push(Actions.nextScene());
	}
});