var context = require('./context');
var createAudioMeter = require('./volume_meter');
var frames = require('./frames');

// 

var playing   = false;
var sample    = null;
var sampleBuffer = null;
window.songStart = 0;
var songDuration = 0;
var pausedAt  = 0;

var finished_cb = function(){};

var meter = createAudioMeter(context);

// dev
var gain = context.createGain();
gain.connect(context.destination);
gain.gain.value = 1;

function load(cb) {
  getSong( function(buffer) {
    sampleBuffer = buffer;
    songDuration = buffer.duration;
    cb();
  });
}

function finished(cb) {
  finished_cb = cb;
}

function pause() {
  if(playing) {
    // put it slightly in the future for the sake of accuracy
    pausedAt = context.currentTime + 0.01;
    sample.stop(pausedAt);
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

    sample = context.createBufferSource();
    sample.buffer = sampleBuffer;
    sample.connect(gain);
    sample.connect(meter);
    // start the sample now at our progress point
    sample.start(context.currentTime, progress);
    sample.onended = end_callback;

    playing = true;
  }
}

function end_callback() {
  // the sample stopped, but we might have just paused.
  if (playing) {
    playing = false;
    finished_cb();
  }
}

// 

function getSong(callback) {
  var request = new XMLHttpRequest();
  request.open("GET", '/audio/threnody.mp3', true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    context.decodeAudioData(request.response, callback);
  };

  request.send();
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
  volume_stream
};

window.play = play;
window.pause = pause;