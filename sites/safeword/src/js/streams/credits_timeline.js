// module.exports = [
// 	{ timestamp: '00.02.000', credit: true }, // text

// 	{ timestamp: '00.07.423', credit: true },
// 	{ timestamp: '00.09.263', credit: true }, // text
// 	{ timestamp: '00.18.267', credit: true },

// 	{ timestamp: '00.20.110', credit: true },
// 	{ timestamp: '00.21.110', credit: true }, // text
// 	{ timestamp: '00.25.879', credit: true },

// 	{ timestamp: '00.27.727', credit: true },
// 	{ timestamp: '00.28.727', credit: true }, // text
// 	{ timestamp: '00.35.114', credit: true },

// 	{ timestamp: '00.36.957', credit: true },
// 	{ timestamp: '00.38.957', credit: true }, // text
// 	{ timestamp: '00.49.876', credit: true },
// ];

// 49 seconds split evenly
let num_of_frames = 6;
let time_per_frame = 6;
let time_per_blank = (48.876 - time_per_frame * num_of_frames) / (num_of_frames * 2);

var events = [];
var time = 0;

for (var i = 0; i < num_of_frames; i++) {
	time += time_per_blank;
	events.push({ timestamp: '00.' + time.toFixed(3), credit: true }); // in blank
	time += time_per_blank;
	events.push({ timestamp: '00.' + time.toFixed(3), credit: true }); // text
	time += time_per_frame;
	events.push({ timestamp: '00.' + time.toFixed(3), credit: true }); // out blank
}


module.exports = events;



