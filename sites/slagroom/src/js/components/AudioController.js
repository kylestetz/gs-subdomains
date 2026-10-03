const frames = require('../streams/frames');
const audio = require('../streams/audio');
const song_structure = require('../streams/song_structure');

function AudioController(state) {

	audio.load(() => {
		dispatch.push(Actions.loading(false));
	});

	// ============================================================
	//  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX 
	// ============================================================

	function start() {
		let app = $('.app')[0];
		let animation = false;
		let start_ts = 0;
		// animation time in ms
		let length = 2000;
		// the shakes, meant to be *= -1
		let shake = 1;
		// magnitude of the shake in px
		let magnitude = 20;
		// magnitude of the magnitude...
		let power = 0;
		let x, y;
		let x_frequency;

		// where t = 0 -> 1
		let ease = (t) => 1+(--t)*t*t*t*t;

		song_structure.onValue(e => {
			if (!e || !e.actions) return;
			let type = e.actions[0];
			if (['snare', 'hit'].indexOf(type) === -1) return;
			power = e.power || 1;
			start_ts = Date.now();
			animation = true;
			shake = 1;
			x_frequency = Math.floor(Math.random() * 12);
		});

		frames.onValue(next);

		function next() {
			if (animation) {
				let progress = (Date.now() - start_ts) / length;

				// exit condition
				if (progress > 1) {
					animation = false;
					app.style.transform = '';
					return;
				}

				// apply shake
				shake *= -1;
				let y = (1 - ease(progress)) * shake * (magnitude * power);
				let x = ((1 - ease(progress)) * shake * (magnitude * power)) * Math.sin(progress * Math.PI*x_frequency);
				app.style.transform = `translate(${x}px, ${y}px)`;
				app.style.opacity = ((ease(progress)) * 0.5) + 0.5;
			}
		}
	}

	// ============================================================
	//  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX  VFX 
	// ============================================================

	function play() {
		audio.play();
	}

	return {
		start,
		play
	};
}

module.exports = AudioController;