const ss = require('./streams/song_structure');
const Bop = require('./bops');

function makeABop(options) {
	let choice = options[_.random(options.length - 1)];
	let b = new Bop({
		x: _.random(100, window.innerWidth - 200),
		y: _.random(100, window.innerHeight - 200),
		word: choice
	});
}

module.exports = {
	start() {
		const words = _(ss.sentences).tail().flatten().uniq().value();
		// dis has de werds 2 pop
		let selected = [];

		$('.safe_words').html(
			words.reduce((markup, w) => {
				return markup + `<div class="word">${w}</div>`;
			}, '')
		);

		$('.word').on('click', e => {
			$(e.target).toggleClass('selected');
			let word = e.target.innerHTML;
			if (selected.includes(word)) {
				selected = _.without(selected, word);
			} else {
				selected.push(word);
			}
		});

		ss.event_stream.filter(e => e && e.bop).onValue(e => {
			makeABop(selected.length ? selected : words);
		});
	}
};