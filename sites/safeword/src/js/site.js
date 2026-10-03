const ball = require('./ball');
const audio = require('./streams/audio');
const ss = require('./streams/song_structure');

$(() => {

	audio.load()
		.then(() => {
			$('.start_indicator, .start_ball').removeClass('loading');
			$('.start_ball').on('click', e => {
				$(document.scrollingElement).animate({ scrollTop: 0 }, {
					duration: 50,
					complete: start
				});
			});

			$('.credit_scroller').css('width', $('.credit').length * 100 + 'vw');
		})
		.catch(e => console.error('ABORT ABORT ABORT', e));

	audio.finished(() => {
		$('.thanks').addClass('show');
	});

	require('./redeem');

});

function start() {
	$('body').css('overflow', 'hidden');
	$('.home').addClass('go-away');
	$('.safeword').removeClass('loading');
	$('.logo').removeClass('large');

	audio.play();
	ball.start();

	let $cs = $('.credit_scroller');
	let credit_count = 0;
	let bgcolors = ['#5fdcaa', '#383436', '#6b0abf', '#f19951', ''];
	let colors = ['white', 'white', 'white', 'white', ''];

	ss.event_stream.onValue(e => {
		if (e && e.start) {
			$('.credits').addClass('go-away');
		} else if (e && e.credit) {
			credit_count++;
			$cs[0].style.transform = `translateX(${credit_count * -100}vw)`;
		}
	});

	let $logo = $('.logo');
	let do_animation = false;
	$logo.on('transitionend', e => {
		$logo.css('transition', 'none');
		do_animation = true;
	});

	audio.volume_stream.onValue(v => {
		if (!do_animation) return;
		$logo[0].style.transform = `translateX(50vw) scale(${0.5 + v * 0.1})`;
	});
}