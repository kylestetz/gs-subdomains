var context;
if (window.AudioContext) {
	context = new window.AudioContext();
} else if (window.webkitAudioContext) {
	context = new window.webkitAudioContext();
}
module.exports = context;