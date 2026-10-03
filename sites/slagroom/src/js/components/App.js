const Component = require('./Component'),
	h = require('virtual-dom/h'),
	SceneController = require('./SceneController'),
	AudioController = require('./AudioController'),
	progressbar = require('./ProgressBar'),
	glitch = require('./Glitch');

function App(initial_state) {

	let sceneController = SceneController(initial_state);
	let audioController = AudioController(initial_state);
	let cached_data = initial_state;

	return Component({
		render(data){

			if (data.current_scene === 1 && cached_data.current_scene === 0) {
				audioController.start();
				audioController.play();
				progressbar.start();
			} else if (data.current_scene !== cached_data.current_scene) {
				progressbar.next();

				if (data.current_scene === 7) {
					glitch.start();
				}
			}
			cached_data = data;

			return h('.app', [
				sceneController.render(data)
			]);
		}
	});
}

module.exports = App;