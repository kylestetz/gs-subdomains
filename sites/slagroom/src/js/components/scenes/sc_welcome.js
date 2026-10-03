function Scene() {
	return {
		render(data) {
			return h('.scene.scene__welcome', [
				h('p',
					['welcome to Abag\'s survey. Please turn your volume up.']
				),
				h('div', [
					data.loading ? h('button.start', {
							attributes: {
								disabled: true
							}
						}, ['loading...']) : h('button.start', {
						onclick: this.next.bind(this)
					}, ['start']),
					h('a', {
						href: '/download',
						className: 'download_link'
					}, [
						'Have a download code? Click here to redeem it.'
					])
				])
			]);
		},
		next() {
			dispatch.push(Actions.nextScene());
		}
	};
}

module.exports = Scene();