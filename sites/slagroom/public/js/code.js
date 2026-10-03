// Code entry for /download. Redeeming the code starts the download straight
// away and swaps the form for a button that downloads again.
(function() {
	var messages = {
		does_not_exist: 'Hmm, I don\'t think that code exists. Try a different one?',
		expired: 'Oops, that download code has been used. Sorry!',
		too_many_attempts: 'Too many tries! Wait a few minutes and try again.',
		server: 'Sorry, something went wrong on our end. Try again later?'
	};

	var heading = document.querySelector('.download h4');
	var input = document.querySelector('.download input');
	var button = document.querySelector('.download .submit');

	button.addEventListener('click', submit);
	input.addEventListener('keypress', function(e) {
		if (e.key === 'Enter') submit();
	});

	function submit() {
		if (button.dataset.download) {
			window.location.href = button.dataset.download;
			return;
		}
		var code = input.value.trim();
		if (!code) return;

		button.disabled = true;
		fetch('/api/redeem', {
			method: 'POST',
			headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ code: code })
		})
			.then(function(response) { return response.json(); })
			.catch(function() { return { error: 'server' }; })
			.then(function(data) {
				button.disabled = false;
				if (!data.download) {
					heading.textContent = messages[data.error] || messages.server;
					return;
				}
				heading.textContent = 'Thanks for your support!';
				input.remove();
				button.textContent = 'Download Slagroom';
				button.dataset.download = data.download;
				window.location.href = data.download;
			});
	}
})();
