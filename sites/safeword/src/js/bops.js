const frames = require('./streams/frames');

const $bops_container = $('.bops_container');
let active_bops = {};

frames.onValue(() => {
	_.forIn(active_bops, b => {
		let t = new Date() / 1000;
		let result = b.render(t);
		if (!result) {
			b.destroy();
			active_bops[b.id] = null;
			delete active_bops[b.id];
		}
	});
});

class Bops {
	constructor({ x, y, word }) {
		this.id = _.uniqueId();
		this.x = x;
		this.y = 100;
		this.word = word;
		this.start = new Date() / 1000;
		this.$el = $(`<div class="bop">${word}</div>`);
		$bops_container.append(this.$el);
		active_bops[this.id] = this;
	}
	render(t) {
		let progress = t - this.start;
		if (progress > 1) return false;

		this.$el.css({
			opacity: 1 - progress,
			transform: `translate(${this.x}px, ${this.y + progress/2*window.innerHeight}px)`
		});

		return true;
	}
	destroy() {
		this.$el.remove();
	}
}

module.exports = Bops;