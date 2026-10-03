const song_structure = require('../streams/song_structure');
const audio = require('../streams/audio');
const frames = require('../streams/frames');
const utils = require('../utils');

let canvas = $('#canvas')[0];
window.ctx = canvas.getContext('2d');

// some default styles
ctx.strokeStyle = 'black';

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

$(window).on('resize', e => {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
});

// go get the abags image now so we have it later
let abags = new Image();
abags.src = '/images/abags.png';

let pattern1 = new Image();
pattern1.src = '/images/pattern2.png';

let pattern2 = new Image();
pattern1.src = '/images/pattern3.png';

let pattern3 = new Image();
pattern1.src = '/images/pattern4.png';

// ======================================================================
// FUN STUFF
// ======================================================================

// let interval = 3000;
let interval = 3000;
let ramp_up_the_fun = false;
let go_wild	= false;

let answer_fields = [
	'name',
	'sandwich',
	'teacher'
];

function random_answer() {
	random_text(Model.get().answers[answer_fields[_.random(2)]]);
}

function draw_image() {
	let w = 300/2;
	let h = 259/2;
	let x = _.random(WIDTH - w);
	let y = _.random(HEIGHT - h);
	ctx.drawImage(abags, x, y, w, h);
}

function random_text(text) {
	ctx.save();
	let size = _.random(12,24);
	ctx.font = `${size}px Averia Serif Libre`;
	ctx.textAlign = 'left';
	let regex_string = `.{${_.random(24,40)}}?`;
	let lines = text ? [text] : utils.mess().match(RegExp(regex_string, 'g'));
	let x = _.random(WIDTH * 0.75 + 50);
	let y = _.random(HEIGHT * 0.75 + 50);
	lines.forEach((line, i) => {
		ctx.fillText(line, x, y + i * (size+4));
	});
	ctx.restore();
}

function pixels() {
	var imagedata = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	for (let i = 0; i < 10000; i++) {
		imagedata.data[_.random(imagedata.data.length - 1)] = _.random(255);
	}
	ctx.putImageData(imagedata, 0, 0);
}

function remove_pixels() {
	if (go_wild) return;
	var imagedata = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	for (let i = 0; i < 500000; i++) {
		imagedata.data[_.random(imagedata.data.length - 1)] = 0;
	}
	ctx.putImageData(imagedata, 0, 0);
}

function twitch() {
	let x = _.random(4, 20) * (_.random() ? -1 : 1);
	let y = _.random(4, 20) * (_.random() ? -1 : 1);
	canvas.style.transform = `translate(${x}px, ${y}px)`;

	setTimeout(() => {
		canvas.style.transform = '';
	}, 30);
}

function pattern() {
	let x = _.random(WIDTH - 200);
	let y = _.random(HEIGHT - 150);
	let r = _.random(2);
	if (r === 0) ctx.drawImage(pattern1, x, y, 200, 150);
	if (r === 1) ctx.drawImage(pattern2, x, y, 200, 150);
	if (r === 2) ctx.drawImage(pattern3, x, y, 200, 150);
	
}

function lines(amt) {
	ctx.save();
	let xs = _.range(amt)
		.map(() => _.random(2, WIDTH - 2))
		.forEach(x => {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, HEIGHT);
			ctx.stroke();
		});
	ctx.restore();
}

// ======================================================================
// DECISIONS
// ======================================================================

function action() {
	if (go_wild) interval = 250;
	if (interval > 500) {
		interval -= 30;
	}

	setTimeout(action, interval);
	let decision = _.random(4);
	if (decision === 0) {
		_.flow(random_text, pixels)();
	} else if (decision === 1) {
		_.flow( _.random() ? random_answer : random_text, pixels )();
	} else {
		remove_pixels();
	}

	if (!_.random(5)) {
		twitch();
	}

	if (!_.random(20)) {
		draw_image();
	}

	// save these ones for later
	if (ramp_up_the_fun) {
		if (!_.random(10)) {
			lines(15);
			remove_pixels();
		}

		if (!_.random(15)) {
			pattern();
		}
	}
}

function fade_screen() {
	var imagedata = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	var l = imagedata.data.length;
	for (var i = 3; i < l; i += 4) {
		imagedata.data[i] -= 2;
	}
	ctx.putImageData(imagedata, 0, 0);
}

function start() {
	setTimeout(action, interval);
	random_text();
	app = $('.app')[0];
}

song_structure.onValue(e => {
	if (!e || !e.actions) return;
	if (e.actions.indexOf('last_chord_start') > -1) {
		ramp_up_the_fun = true;
		$('#canvas').css('opacity', 1);
	} else if (e.actions.indexOf('last_chord_end') > -1) {
		go_wild = true;
	} else if (e.actions.indexOf('finished') > -1) {
		dispatch.push(Actions.setFinished(true));
	}
});

let bit = 1;
let app;

audio.volume_stream.onValue((v) => {
	if (go_wild) {
		let volume = Math.min(v * (1 / 0.06), 1);
		fade_screen();
		lines(Math.floor(_.random(volume * 5)));

		bit *= -1;
		if (app) app.style.transform = `translate(${volume * 10 * bit * Math.sin(Date.now()/3000)}px, ${volume * 10 * -bit * Math.sin(Date.now()/1000)}px)`;
	}
});

module.exports = {
	start
};