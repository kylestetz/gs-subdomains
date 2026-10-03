// rendered by App.js, controls lifecycle of Scenes.
const _ = require('lodash'),
	h = require('virtual-dom/h');

// require the scenes here
let SCENES = [
	require('./scenes/sc_welcome'),
	require('./scenes/sc_your_name'),
	require('./scenes/sc_gender'),
	require('./scenes/sc_favorite_color'),
	require('./scenes/sc_teacher'),
	require('./scenes/sc_online_surveys'),
	require('./scenes/sc_happy_person'),
	require('./scenes/sc_hi_sexxy'),
	require('./scenes/sc_sorry_about_that'),
	require('./scenes/sc_are_you_happy'),
	require('./scenes/sc_kitchen'),
	require('./scenes/sc_a_good_teacher'),
	require('./scenes/sc_sandwich'),
	require('./scenes/sc_sandwich_mood'),
	require('./scenes/sc_sandwich_teacher'),
	require('./scenes/sc_mariah'),
	require('./scenes/sc_child_obey'),
	require('./scenes/sc_adult_obey'),
	require('./scenes/sc_click_the_button'),
	require('./scenes/sc_anxious'),
	require('./scenes/sc_church'),
	require('./scenes/sc_church_teacher'),
	require('./scenes/sc_like_to_think_that'),
	require('./scenes/sc_soap'),
	require('./scenes/sc_soap_reviews'),
	require('./scenes/sc_enjoying'),
	require('./scenes/sc_dentist'),
	require('./scenes/sc_dental_insurance'),
	require('./scenes/sc_enhance_dental'),
	require('./scenes/sc_nice_girl'),
	require('./scenes/sc_best_prices_on'),
	require('./scenes/sc_our_features'),
	require('./scenes/sc_random'),
];

let finished = require('./scenes/sc_finish');

function SceneController(initial_data) {
	let current_scene = null;
	let last_data = initial_data;
	current_scene = SCENES[initial_data.current_scene];
	_.invoke(current_scene, 'start', initial_data);

	$('body').on('keypress', e => {
		if (e.key === ' ' && e.shiftKey) {
			dispatch.push(Actions.nextScene());
		} else if (e.key === 'Enter') {
			// call the current scene's "ok" button
			_.invoke(current_scene, 'next');
		}
	});

	function render(data) {
		if (data.current_scene !== last_data.current_scene && data.current_scene <= SCENES.length - 1) {
			_.invoke(current_scene, 'stop', data);
			current_scene = SCENES[data.current_scene];
			_.invoke(current_scene, 'start', data);
		}

		if (data.force_get_mad && !last_data.force_get_mad) {
			current_scene.getMad();
		}

		if (data.finished && !last_data.finished) {
			_.invoke(current_scene, 'stop', data);
			finished.start(data);
			current_scene = finished;
		} else if (!data.finished && data.current_scene !== last_data.current_scene && data.current_scene > SCENES.length - 1) {
			_.defer(() => _.invoke(current_scene, 'next'));
			// console.error('Can\'t find the next scene. Add it to the scene controller!');
		}

		last_data = data;
		return current_scene.render(data);
	}

	return {
		render
	};
}

module.exports = SceneController;