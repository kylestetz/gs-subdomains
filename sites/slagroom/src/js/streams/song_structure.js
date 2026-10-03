var audio = require('./audio');

var timestamps = [
	{ timestamp: '00.16.498', actions: ['hit'], power: 0.2 },
	// { timestamp: '00.27.411', actions: ['snare'] },
	{ timestamp: '00.36.963', actions: ['hit'], power: 0.4 },
	// { timestamp: '00.46.511', actions: ['snare'] },
	{ timestamp: '00.56.055', actions: ['hit'], power: 0.6 },
	// { timestamp: '01.05.610', actions: ['snare'] },
	{ timestamp: '01.15.161', actions: ['hit'] },
	{ timestamp: '01.24.709', actions: ['snare'] },
	{ timestamp: '01.35.623', actions: ['snare'] },
	{ timestamp: '01.41.084', actions: ['hit'] },
	{ timestamp: '01.50.631', actions: ['hit'] },
	{ timestamp: '02.00.179', actions: ['snare'] },
	{ timestamp: '02.09.743', actions: ['hit'] },
	{ timestamp: '02.19.278', actions: ['snare'] },
	{ timestamp: '02.28.831', actions: ['hit'] },
	{ timestamp: '02.37.020', actions: ['hit'] },
	{ timestamp: '02.38.375', actions: ['snare'] },
	{ timestamp: '02.47.941', actions: ['hit'] },
	{ timestamp: '02.56.116', actions: ['hit'] },
	{ timestamp: '03.04.412', actions: ['last_chord_start'] },
	{ timestamp: '03.15.284', actions: ['last_chord_end'] },
	{ timestamp: '04.24.000', actions: ['finished'] }
	// ...
];

var song_markers = timestamps.map(function(t) {
  var parts = t.timestamp.split('.');
  var time = +parts[0] * 60;
  time += +parts[1];
  time += (+parts[2] * 1/1000);
  t.time = time;
  return t;
});

// ======================================================
// STRUCTURE CHANGES
// ======================================================

var song = new Bacon.Bus();

audio.structure_stream.onValue( function(position) {
	if (position === 0) return;
	song.push(find_action(song_markers, position));
});

var changes = song.skipDuplicates();

function find_action(arr, val) {
	for(var i = arr.length - 1; i >= 0; i--) {
		if(val >= arr[i].time) {
			return arr[i];
		}
	}
	return null;
}

module.exports = changes;