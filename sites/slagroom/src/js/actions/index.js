const Bacon = require('baconjs');
var dispatch = new Bacon.Bus();

module.exports = {
	dispatch,

	setCurrentScene(scene) {
		return {
			type: 'SET_CURRENT_SCENE',
			current_scene: scene
		};
	},

	nextScene() {
		return {
			type: 'NEXT_SCENE'
		};
	},

	setAnswer(answer) {
		return {
			type: 'SET_ANSWER',
			answer: answer
		};
	},

	flash() {
		// this is an empty action used to trigger a re-render.
		return {
			type: 'FLASH'
		};
	},

	loading(flag) {
		return {
			type: 'LOADING',
			loading: flag
		};
	},

	getMad(flag) {
		return {
			type: 'SET_FORCE_GET_MAD',
			force_get_mad: flag
		};
	},

	setFinished(flag) {
		return {
			type: 'SET_FINISHED',
			finished: flag
		};
	}

};