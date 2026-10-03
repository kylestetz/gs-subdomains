const $input = $('[data-redeem-input]');
const $feedback = $('[data-feedback]');
const $redeem = $('.redeem');

$('[data-redeem-input]').on('keydown', e => {
	if (e.which === 13) {
		if (!e.target.value) {
			feedback('Enter a code!', true);
		} else {
			validate(e.target.value);
		}
	}
});

$('[data-redeem-submit]').on('click', e=> {
	if ($input.val()) {
		validate($input.val());
	} else {
		feedback('Enter a code!', true);
	}
});

$('[data-go-to-redeem]').on('click', e => {
	$(document.scrollingElement).animate({
		scrollTop: window.innerHeight
	}, 400);
});

function feedback(text, warning) {
	$feedback.text(text).toggleClass('orange', warning);
}

function loading(flag) {
	$redeem.css('opacity', flag ? 0.5 : 1);
}

// Redeeming the code starts the download right away.
function validate(code) {
	loading(true);
	fetch('/api/redeem', {
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({ code }),
	})
		.then(response => response.json())
		.catch(() => ({ error: 'server' }))
		.then(data => {
			loading(false);

			if (data.download) {
				// switch out the inputs for a link
				feedback('Thanks for your support!', false);
				$redeem.html('Click here to download'.link(data.download));
				window.location.href = data.download;
			} else if (data.error === 'does_not_exist') {
				feedback('That code doesn’t exist.', true);
			} else if (data.error === 'expired') {
				feedback('Oops! That code is expired.', true);
			} else if (data.error === 'too_many_attempts') {
				feedback('Too many tries! Wait a few minutes.', true);
			} else {
				feedback('Sorry, something went wrong. Try again later?', true);
			}
		});
}