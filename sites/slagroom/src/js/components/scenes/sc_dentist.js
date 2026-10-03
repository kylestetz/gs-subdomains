const Scene = require('./Scene');

let skipped = false;

module.exports = new Scene({
	prompt: 'For security reasons, when was the last time you went to the dentist?',
	madPrompt: 'It is absolutely essential that you answer this question. When was the last time you went to the dentist ?',
	render(data) {
		return h('.scene.scene__dentist', [
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
			dispatch.push(Actions.setAnswer({ dentist: this.answer }));
			dispatch.push(Actions.nextScene());
		}
	}
});