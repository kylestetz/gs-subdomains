const _ = require('lodash'),
	Bacon = require('baconjs');

function _log(action, ...rest) {
	return;
	if (action && action.type) {
		console.log('%cDispatch:', 'color: blue; font-weight: bold;', action.type);
		console.log(_.omit(action, 'type'));
	} else {
		console.log('%cDispatch:', 'color: blue; font-weight: bold;');
		console.log.apply(console, arguments);
	}
}

var INITIAL_STATE = {
	current_scene: 0,
	answers: {},
	loading: true,
	force_get_mad: false,
	finished: false
};

function Model() {
	var _state = INITIAL_STATE;
	var changes = new Bacon.Bus();

	function listen(stream) {
		stream.onValue(action => {
			if (typeof action === 'function') {
				_log('Dispatching a function. ⦿〰⦿');
				action();
			} else {
				_log(action);
				_state = merge(_state, action);
				changes.push(_state);
			}
		});
	}

	function get() {
		return _state;
	}

	function merge(state, action) {
		switch (action.type) {
			case 'SET_CURRENT_SCENE':
				return _.assign({}, state, {
					current_scene: action.current_scene
				});
			case 'NEXT_SCENE':
				return _.assign({}, state, {
					current_scene: state.current_scene + 1
				});
			case 'SET_ANSWER':
				return _.assign({}, state, {
					answers: _.assign({}, state.answers, action.answer)
				});
			case 'FLASH':
				// hi, bye
				return state;
			case 'LOADING':
				return _.assign({}, state, {
					loading: action.loading
				});
			case 'SET_FORCE_GET_MAD':
				return _.assign({}, state, {
					force_get_mad: action.force_get_mad
				});
			case 'SET_FINISHED':
				return _.assign({}, state, {
					finished: action.finished
				});
			default:
				console.error('The action type', action.type, 'is not implemented in the model');
				return state;
		}
	}

	return {
		listen,
		changes,
		get
	};
}

var model = Model();
module.exports = model;