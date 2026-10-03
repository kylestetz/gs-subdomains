const context = require('../streams/context');

const minTime = 30,
	maxTime = 400,
	FASTEST = 50;

let songDuration = 264.22;

function randomTime() {
	let min = minTime;
	let max = maxTime;
	// not sure that we want the words to speed up
	// if (window.songStart > 0) {
	// 	let progress = (context.currentTime - window.songStart)/songDuration;
	// 	max = maxTime - ((maxTime - FASTEST) * progress);
	// }
	return Math.floor(Math.random() * (max-min) + min);
}

module.exports = {
	type(text, cb, done) {
		let words = text.split(' ');
		setTimeout(next, randomTime());

		function next() {
			let word = words.splice(0, 1);
			if (words.length) {
				word += ' ';
			}
			cb(word);

			if (words.length) {
				setTimeout(next, randomTime());
			} else {
				setTimeout(done, 33);
			}
		}
	}
};