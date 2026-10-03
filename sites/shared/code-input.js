// Download code form shared by the album sites. Renders into any element
// with a data-code-input attribute.
//
// Submitting a code redeems it and starts the download straight away; the
// "Download the album" link stays up in case the browser blocks it or the
// buyer wants to download again.

const MESSAGES = {
	prompt: 'Enter your download code.',
	does_not_exist: 'Whoops! That’s not a real code.',
	expired: 'Sorry, that code has expired.',
	too_many_attempts: 'Too many tries! Wait a few minutes and try again.',
	server: 'Sorry, there’s a problem on our end. Try again later :(',
};

export async function redeem(code) {
	try {
		const response = await fetch('/api/redeem', {
			method: 'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ code }),
		});
		const data = await response.json();
		if (data.download) return { download: data.download };
		return { error: MESSAGES[data.error] ? data.error : 'server' };
	} catch {
		return { error: 'server' };
	}
}

function mount(root) {
	root.classList.add('CodeInput');
	root.innerHTML = `
		<fieldset class="code">
			<label for="code" class="code__label"></label>
			<input id="code" class="code__input" type="text" name="code" placeholder="ABC"
				autocomplete="off" autocapitalize="characters" spellcheck="false">
			<button class="code__submit">submit</button>
		</fieldset>
		<div class="download">
			<a href="">Download the album</a>
		</div>
	`;

	const fieldset = root.querySelector('.code');
	const label = root.querySelector('.code__label');
	const input = root.querySelector('.code__input');
	const submit = root.querySelector('.code__submit');
	const download = root.querySelector('.download');
	const link = download.querySelector('a');

	label.textContent = MESSAGES.prompt;

	const ready = () => input.value.trim().length > 2;

	input.addEventListener('input', () => {
		label.textContent = MESSAGES.prompt;
		submit.classList.toggle('code__submit--visible', ready());
	});
	input.addEventListener('keyup', (e) => {
		if (e.key === 'Enter' && ready()) onSubmit();
	});
	submit.addEventListener('click', onSubmit);

	async function onSubmit() {
		if (input.disabled) return;
		setLoading(true);
		const result = await redeem(input.value);
		setLoading(false);

		if (result.error) {
			label.textContent = MESSAGES[result.error];
			return;
		}

		link.href = result.download;
		fieldset.classList.add('code--download');
		download.classList.add('download--visible');
		window.location.assign(result.download);
	}

	function setLoading(loading) {
		input.disabled = loading;
		input.classList.toggle('loading', loading);
		submit.classList.toggle('code__submit--loading', loading);
	}
}

document.querySelectorAll('[data-code-input]').forEach(mount);
