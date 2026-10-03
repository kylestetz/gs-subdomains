function Scene() {
	let prompt = 'What is the name of the last person you kissed?';
	let tried_to_skip = false;
	let last_person_you_kissed = '';

	return {
		render(data) {
			return h('.scene.scene__last_person_you_kissed', [
				h('p',
					[prompt]
				),
				h('.form', [
					h('input', {
						attributes: {
							type: 'text'
						},
						onkeyup: e => {
							last_person_you_kissed = e.target.value;
						}
					}),
					h('button', {
						onclick: e => {
							// validate?
							if (!last_person_you_kissed.trim()) {
								prompt = 'Please.';
								dispatch.push(Actions.flash());
							} else {
								dispatch.push(Actions.setAnswer({ last_person_you_kissed }));
								dispatch.push(Actions.nextScene());
							}
						}
					}, ['ok'])
				].concat(
					tried_to_skip ? [] : h('button', {
						onclick: e => {
							tried_to_skip = true;
							prompt = 'It is absolutely essential that you answer this question. What is the name of the last person you kissed?';
							dispatch.push(Actions.flash());
						}
					}, ['skip this question'])
				))
			]);
		}
	};
}

module.exports = Scene();