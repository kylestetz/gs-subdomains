const frames = require('../streams/frames');
const context = require('../streams/context');

let started = false;
let question_time = 14;
let last_ts = 0;
let next_ts = 0;

let $bar = $('.progress_bar__indicator');

frames.onValue(() => {
	if (started) {
		if (Model.get().finished) return;
		let progress = (context.currentTime - last_ts) / question_time;
		$bar[0].style.transform = `scaleX(${progress})`;

		if (context.currentTime > next_ts) {
			last_ts = next_ts;
			next_ts = last_ts + question_time;
			// this might have to be a mechanism to force a setAnswer call from the current scene
			// 	(maybe via Scene.forceAnswer, which dispatches a setAnswer call)
			dispatch.push(Actions.getMad(true));
		}
	}
});

function pause() {
	started = false;
	$bar[0].style.transform = 'scaleX(0)';
}

function start() {
	last_ts = context.currentTime;
	next_ts = last_ts + question_time;
	started = true;
}

function next() {
	last_ts = context.currentTime;
	next_ts = last_ts + question_time;
	// ???
	question_time -= 0.2;
}

window.reset_timer = next;
window.pause_timer = pause;
window.start_timer = start;

module.exports = {
	start,
	next
};