const Scene = require('./Scene');

let skipped = false;

module.exports = new Scene({
	prompt: 'For security purposes what was the name of the your first grade teacher?',
	madPrompt: 'It is absolutely essential that you answer this question. What was the name of the your first grade teacher ?',
	render(data) {
		return h('.scene.scene__teacher', [
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
				}, ['ok']),
			].concat(
				skipped ? [] : h('button', {
					onclick: e => {
						skipped = true;
						this.getMad();
					}
				}, ['skip this question'])
			)) : []
		));
	},
	next() {
		if (!this.answer || !this.answer.trim()) {
			this.getMad();
		} else {
			dispatch.push(Actions.setAnswer({ teacher: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});