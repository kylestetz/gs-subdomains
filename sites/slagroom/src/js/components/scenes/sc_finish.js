const Scene = require('./Scene');
const utils = require('../../utils');

let release_date = new Date('2016-10-21T00:00:00+00:00');

function released() {
	return Date.now() > release_date.valueOf();
}

module.exports = new Scene({
	prompt: 'Thank you for taking our survey! Your answers will help us help you.',
	render(data) {
		return h('.scene.scene__finish', [
				h('p.question',
					[this.prompt]
				)
			].concat(
				this.showForm ? h('.form', {
					className: this.fadeIn ? 'fade-in' : ''
				}, [
					h('p', [
						h('a', { attributes: { href: 'https://grindselect.bandcamp.com/album/slagroom' } }, ['Slagroom']),
						` by all boy/all girl is out ${ released() ? 'now' : 'October 21st'} on Grind Select`
					])
			]) : []
		));
	},
	next() {
		// nope
	}
});