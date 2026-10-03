const _ = require('lodash');

function Component(child) {
	var _render_count = 0;
	var _started = false;

	return {
		render: function(data) {
			if (!_started) {
				_render_count++;
				if (_render_count == 2) {
					_started = true;
					(child.started || _.noop)(data);
				}
			}
			return (child.render || _.noop)(data);
		}
	};
}

module.exports = Component;