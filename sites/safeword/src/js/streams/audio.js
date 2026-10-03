var context = require('./context');
var createAudioMeter = require('./volume_meter');
var frames = require('./frames');

// 

var playing   = false;
var sample    = null;
var samples = [];
var sampleBuffer = null;
var sampleBuffers = [];
window.songStart = 0;
var songDuration = 0;
var pausedAt = 0;

// var pausedAt  = 185;

var finished_cb = function(){};

var meter = createAudioMeter(context);

var gains = [0,1].map(i => {
	let gain = context.createGain();
	gain.connect(context.destination);
	gain.gain.value = 0;
	return gain;
});

function load() {
	let s1 = getSong('/audio/safeword.mp3');
	let s2 = getSong('/audio/safeword_karaoke.mp3');
	return Promise.all([s1, s2])
		.then(buffs => {
			sampleBuffers = buffs;
			songDuration = buffs[0].duration;
			set_sound(0);
		});
}

function finished(cb) {
	finished_cb = cb;
}

function pause() {
	if(playing) {
		// put it slightly in the future for the sake of accuracy
		pausedAt = context.currentTime + 0.01;
		// sample.stop(pausedAt);
		samples.forEach(s => s.stop(pausedAt));
		playing = false;
	}
}

function play() {
	if(!playing) {
		// how far were we through the song?
		var progress = pausedAt - songStart;
		// if the song picked up now, what would its
		// virtual start point have been? the stream needs
		// this value.
		window.songStart = context.currentTime - progress;

		samples = sampleBuffers.map((s,i) => {
			let sample = context.createBufferSource();
			sample.buffer = s;
			sample.connect(gains[i]);
			sample.connect(meter);
			sample.start(context.currentTime, progress);
			sample.onended = end_callback;
			return sample;
		});

		playing = true;
	}
}

function set_sound(index) {
	gains.forEach((g, i) => {
		if (i === index) {
			g.gain.value = 1;
		} else {
			g.gain.value = 0;
		}
	});
}

function end_callback() {
	// the sample stopped, but we might have just paused.
	if (playing) {
		playing = false;
		finished_cb();
	}
}

// 

function getSong(path) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();
		request.open("GET", path, true);
		request.responseType = "arraybuffer";

		request.onload = function() {
			context.decodeAudioData(request.response, buffer => resolve(buffer));
		};

		request.send();
	});
}

var structure_stream = frames.map(function() {
	return playing ? context.currentTime - window.songStart : 0;
});

var progress_stream = frames.map(function() {
	return playing ?
		(context.currentTime - window.songStart) / songDuration :
		(pausedAt - window.songStart) / songDuration
	;
});

var volume_stream = frames.map(() => {
	return meter.volume;
});

module.exports = {
	load,
	play,
	pause,
	finished,
	structure_stream,
	progress_stream,
	set_sound,
	volume_stream
};

window.play = play;
window.pause = pause;
window.load = load;