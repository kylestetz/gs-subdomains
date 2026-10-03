const Scene = require('./Scene');

module.exports = new Scene({
	started(data) {
		this.targetPrompt = `How do you think ${data.answers.teacher} would feel about that?`;
		this.madPrompt = `Hello? ${data.answers.name}? This is important. How do you think ${data.answers.teacher} would feel about this?`;
	},
	render(data) {
		return h('.scene.scene__church_teacher', [
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
			dispatch.push(Actions.setAnswer({ church_teacher: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});