const _ = require('lodash');

let mess_bits = [
	'ø∆®ø©ˆ˜',
	'mari1',
	'34yniª˙´¢',
	'best offer',
	'do u wamt',
	'ª•£˜†£˙',
	'ƒ®3ak',
	'©©©©©©©©©©©©',
	'continued',
	'in the last og',
	'h˙˚øµ®©',
	'created',
	'for',
	'simple',
	'dental plan',
	'nic˙k',
	'spanning',
	'anger',
	'®˙©º∆˜¢®',
	'£¢∞§¶•',
	'ººººº',
	'∂',
	'¢',
	'ª',
	'˙©∂∫º',
	'complete',
	'</head>',
	'if (data.current_scéne !== lªst_data.current_sceñe) {',
	'compl',
	'cºnsole.er®ør(\'Can\'t find',
	'9724',
	'forgotten',
	'into extreme ',
	'p1lls',
	'∂oenst',
	'Here’s a bit more about VIDA',
	'recommend visiting our d',
	'LOAN FUNDING',
	'high qualit y low cost',
	'solution',
	'expressing,',
	'UGG',
	'Carolin',
	'FW: REPLy',
	'fundsreleaseinfo',
	'Oakley Outlet',
	'soap dispenser',
	'dental soap',
	'I am in the military unit here in Af',
	'some amount of funds',
	'believe in the pow',
	'terms and procedure',
	'in the past we have',
	'[REVIEW]',
	'tyour credit sc0∆™re',
	'∞',
	'¶',
	'•',
	'¡¡¡¡¡¡'
];

module.exports = {
	delay: function(time) {
		return new Promise(function(resolve) {
			_.delay(function() {
				resolve();
			}, time);
		});
	},
	forms: {
		radio: function(group, name, label, onClick, opts) {
			 return h('label', { attributes: { for: name }, className: opts && opts.className }, [
				h('input', {
					attributes: {
						name: group,
						id: name,
						type: 'radio',
						value: name,
						disabled: opts && opts.disabled
					},
					onclick: onClick
				}),
				label
			]);
		}
	},
	animation: require('./animation'),
	mess() {
		let end = _.random(7, 20);
		return _(mess_bits).shuffle().shuffle().shuffle().slice(0, end).join(' ');
	},
	single_mess() {
		return _.shuffle(mess_bits)[0];
	}
};