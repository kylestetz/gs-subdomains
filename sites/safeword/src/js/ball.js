var ss = require('./streams/song_structure');
const audio = require('./streams/audio');

let wrapword = w => `<span class="word">${w}</span>`;
let wrapsentence = s => `<div class="sentence">${s}</div>`;

module.exports = {
	start() {
		$('.sentences').html(
			ss.sentences.reduce((markup, ws) => {
				return markup + wrapsentence(_.map(ws, wrapword).join(' '));
			}, '')
		);

		$('[data-size-me]').css('width', `${ss.sentences.length * 100}vw`);


		let $words = $('.word');
		let $ball = $('.ball');
		let $karaoke = $('.karaoke');


		function setPositions() {
			$karaoke[0].style.transition = 'none';
			positions = $('.word').map((i, el) => $(el).position().left + $(el).outerWidth()/2 ).toArray();
			$karaoke[0].style.transition = '';
		}

		var positions;
		setPositions();
		$(window).resize(setPositions);

		// init
		$ball.css({
			transform: `translate(${positions[0] - 15}px, 80px)`
			// opacity: 1
		});

		let word = -1;
		let syllable = false;
		let page = 0;

		// possible data in an event:
		// 	null (beginning)
		// 	next (for moving to the next sentence)
		//  word
		ss.event_stream.onValue(e => {
			if (!e) return;
			if (e.bop) return;
			if (e.fade_ball_in) return $ball.css({ opacity: 1 });
			if (e.fade_sentences_out) return $('.sentences').css({ opacity: 0 });
			if (e.next) {
				page++;
				$karaoke.css('transform', `translate(${page * -100}vw, 0)`);
			} else if (e.word) {
				word++;
				$words[word].style.color = '#d44f34';
			}

			// if the next event is an extra syllable this will be true
			syllable = !!e.syllable_next;
		});

		let start, len, rotation = 0;

		ss.ball_progress.onValue(p => {
			rotation += 3;
			let len = syllable ? 0 : positions[word + 1] - positions[word];
			if (word === positions.length || !p) return;
			let height = len > 0 ? (-80 * (len/200)) : -80;
			let ypos = Math.sin(p * Math.PI) * height + 80;
			$ball[0].style.transform = `translate(${len * p + positions[word] - 15}px, ${ypos}px) rotate(${rotation}deg)`;
		});

		function moveBall(pos) {
			$ball.css('transform', `translate(${pos - 15}px, 80px`);
		}

		// SOUND TOGGLE

		let sound = 0;
		let $toggle = $('[data-sound-toggle]');
		$toggle.on('click', e => {
			sound = 1 - sound;
			audio.set_sound(sound);
			$(document.body).toggleClass('dark');
			// $toggle.text(`Karaoke Mode: ${sound ? 'on' : 'off'}`);
		});
	}
};

function isEventInteresting(e) {
	if (!e || (!e.start && !e.next && !e.word)) return false;
	return true;
}

