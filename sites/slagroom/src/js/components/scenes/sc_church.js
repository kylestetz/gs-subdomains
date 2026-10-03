const Scene = require('./Scene');

module.exports = new Scene({
	prompt: 'How often do you go to church?',
	started(data) {
		this.madPrompt = `${data.answers.name}? How often do you go to church?`;
	},
	render(data) {
		return h('.scene.scene__church', [
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
		if (!this.answer || !this.answer.trim()) {
			this.getMad();
		} else {
			dispatch.push(Actions.setAnswer({ church: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});