const Scene = require('./Scene');

module.exports = new Scene({
	prompt: 'Thanks for agreeing to take our survey! First we\'d like to know a little bit about you... What\'s your name?',
	madPrompt: 'Whoops! Didn\'t catch that. We\'d like to know a little bit about you... What\'s your name?',
	render(data) {
		return h('.scene.scene__what_is_your_name', [
			h('p.question',
				[this.prompt]
			)
		].concat(
			this.showForm ? h('.form', {
				className: this.fadeIn ? 'fade-in' : ''
			}, [
				h('input', {
					attributes: {
						type: 'text'
					},
					onkeyup: this.setAnswerFromEvent.bind(this)
				}),
				h('button', {
					onclick: this.next.bind(this)
				}, ['ok'])
			]) : []
		));
	},
	next() {
		// validate?
		if (!this.answer || !this.answer.trim()) {
			this.getMad();
		} else {
			dispatch.push(Actions.setAnswer({ name: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});