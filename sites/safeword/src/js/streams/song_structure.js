var audio = require('./audio');

// "Safe Word" by Moon Bounce
// • words and music by Corey Regensburg

// I don’t need a safe word
// I don’t wanna be able to be heard
// I don’t need my hands to be free
// I don’t want it to be easy

// Hot wax
// Make it pop
// Slow drip
// Make the body, AH
// Cold steel
// Keep it locked
// Mouth shut
// Get rocked

var timestamps = require('./credits_timeline').concat([
	{ timestamp: '00.50.000', start: true },
	{ timestamp: '00.50.900', word: ' ', line_start: true },
	{ timestamp: '00.51.000', next: true },
	{ timestamp: '00.51.300', fade_ball_in: true },
	{ timestamp: '00.51.722', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '00.52.200', syllable: true, syllable_next: true },
	{ timestamp: '00.52.413', syllable: true, syllable_next: true },
	{ timestamp: '00.52.645', syllable: true },
	{ timestamp: '00.52.899', word: 'don’t' },
	{ timestamp: '00.53.076', word: 'need' },
	{ timestamp: '00.54.260', word: 'a' },
	{ timestamp: '00.54.483', word: 'safe' },
	{ timestamp: '00.54.972', word: 'word' },

	{ timestamp: '00.55.404', next: true },

	{ timestamp: '00.56.106', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '00.56.230', syllable: true, syllable_next: true },
	{ timestamp: '00.56.340', syllable: true },
	{ timestamp: '00.56.599', word: 'don’t' },
	{ timestamp: '00.56.812', word: 'wanna', syllable_next: true },
	{ timestamp: '00.57.000', syllable: true },
	{ timestamp: '00.57.261', word: 'be' },
	{ timestamp: '00.57.763', word: 'able', syllable_next: true },
	{ timestamp: '00.57.953', syllable: true },
	{ timestamp: '00.58.175', word: 'to' },
	{ timestamp: '00.58.399', word: 'be' },
	{ timestamp: '00.58.654', word: 'heard' },

	{ timestamp: '00.59.000', next: true },

	{ timestamp: '00.59.334', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '00.59.799', syllable: true, syllable_next: true },
	{ timestamp: '01.00.028', syllable: true, },
	{ timestamp: '01.00.294', word: 'don’t' },
	{ timestamp: '01.00.481', word: 'need' },
	{ timestamp: '01.00.720', word: 'my' },
	{ timestamp: '01.00.954', word: 'hands' },
	{ timestamp: '01.01.645', word: 'to' },
	{ timestamp: '01.01.873', word: 'be' },
	{ timestamp: '01.02.200', word: 'free' },

	{ timestamp: '01.02.798', next: true },

	{ timestamp: '01.03.723', word: 'I', line_start: true },
	{ timestamp: '01.03.953', word: 'don’t' },
	{ timestamp: '01.04.183', word: 'want' },
	{ timestamp: '01.04.416', word: 'it' },
	{ timestamp: '01.04.828', word: 'to' },
	{ timestamp: '01.05.118', word: 'be' },
	{ timestamp: '01.05.600', word: 'easy', syllable_next: true },
	{ timestamp: '01.05.807', syllable: true },

	{ timestamp: '01.06.200', next: true },

	{ timestamp: '01.06.491', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.06.958', syllable: true, syllable_next: true },
	{ timestamp: '01.07.195', syllable: true, syllable_next: true },
	{ timestamp: '01.07.414', syllable: true, syllable_next: true },
	{ timestamp: '01.07.901', syllable: true, syllable_next: true },
	{ timestamp: '01.08.338', syllable: true, syllable_next: true },
	{ timestamp: '01.08.558', syllable: true, syllable_next: true },
	{ timestamp: '01.09.246', syllable: true },
	{ timestamp: '01.09.463', word: 'don’t' },
	{ timestamp: '01.09.733', word: 'need' },

	{ timestamp: '01.09.953', next: true },

	{ timestamp: '01.10.184', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.10.647', syllable: true, syllable_next: true },
	{ timestamp: '01.10.884', syllable: true, syllable_next: true },
	{ timestamp: '01.11.112', syllable: true, syllable_next: true },
	{ timestamp: '01.11.580', syllable: true, syllable_next: true },
	{ timestamp: '01.12.034', syllable: true, syllable_next: true },
	{ timestamp: '01.12.263', syllable: true, syllable_next: true },
	{ timestamp: '01.12.969', syllable: true },
	{ timestamp: '01.13.193', word: 'don’t' },
	{ timestamp: '01.13.429', word: 'need' },

	{ timestamp: '01.13.652', next: true },

	{ timestamp: '01.13.877', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.14.341', syllable: true, syllable_next: true },
	{ timestamp: '01.14.578', syllable: true, syllable_next: true },
	{ timestamp: '01.14.801', syllable: true, syllable_next: true },
	{ timestamp: '01.15.294', syllable: true, syllable_next: true },
	{ timestamp: '01.15.726', syllable: true, syllable_next: true },
	{ timestamp: '01.15.988', syllable: true, syllable_next: true },
	{ timestamp: '01.16.645', syllable: true },
	{ timestamp: '01.16.840', word: 'don’t' },
	{ timestamp: '01.17.120', word: 'need' },

	{ timestamp: '01.17.349', next: true },

	{ timestamp: '01.17.575', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.18.068', syllable: true, syllable_next: true },
	{ timestamp: '01.18.280', syllable: true, syllable_next: true },
	{ timestamp: '01.18.494', syllable: true, syllable_next: true },
	{ timestamp: '01.18.966', syllable: true, syllable_next: true },
	{ timestamp: '01.19.692', syllable: true },

	{ timestamp: '01.20.657', next: true },

	{ timestamp: '01.21.260', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.21.494', syllable: true, syllable_next: true },
	{ timestamp: '01.21.723', syllable: true, syllable_next: true },
	{ timestamp: '01.21.958', syllable: true, syllable_next: true },
	{ timestamp: '01.22.191', syllable: true, syllable_next: true },
	{ timestamp: '01.22.653', syllable: true, syllable_next: true },
	{ timestamp: '01.23.108', syllable: true, syllable_next: true },
	{ timestamp: '01.23.346', syllable: true, syllable_next: true },
	{ timestamp: '01.24.030', syllable: true },
	{ timestamp: '01.24.280', word: 'don’t' },
	{ timestamp: '01.24.491', word: 'need' },

	{ timestamp: '01.24.708', next: true },

	{ timestamp: '01.24.954', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.25.451', syllable: true, syllable_next: true },
	{ timestamp: '01.25.882', syllable: true, syllable_next: true },
	{ timestamp: '01.26.339', syllable: true, syllable_next: true },
	{ timestamp: '01.26.800', syllable: true, syllable_next: true },
	{ timestamp: '01.27.063', syllable: true, syllable_next: true },
	{ timestamp: '01.27.747', syllable: true },
	{ timestamp: '01.27.957', word: 'don’t' },
	{ timestamp: '01.28.189', word: 'need' },

	{ timestamp: '01.28.413', next: true },

	{ timestamp: '01.28.652', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.29.122', syllable: true, syllable_next: true },
	{ timestamp: '01.29.341', syllable: true, syllable_next: true },
	{ timestamp: '01.29.572', syllable: true, syllable_next: true },
	{ timestamp: '01.30.031', syllable: true, syllable_next: true },
	{ timestamp: '01.30.494', syllable: true, syllable_next: true },
	{ timestamp: '01.30.744', syllable: true, syllable_next: true },
	{ timestamp: '01.31.189', syllable: true },
	{ timestamp: '01.31.673', word: 'don’t' },
	{ timestamp: '01.31.876', word: 'need' },

	{ timestamp: '01.32.120', next: true },

	{ timestamp: '01.32.346', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.32.800', syllable: true, syllable_next: true },
	{ timestamp: '01.33.034', syllable: true, syllable_next: true },
	{ timestamp: '01.33.268', syllable: true, syllable_next: true },
	{ timestamp: '01.33.752', syllable: true, syllable_next: true },
	{ timestamp: '01.34.189', syllable: true, syllable_next: true },
	{ timestamp: '01.34.441', syllable: true, syllable_next: true },
	{ timestamp: '01.34.648', syllable: true, syllable_next: true },
	{ timestamp: '01.34.895', syllable: true, syllable_next: true },
	{ timestamp: '01.35.114', syllable: true, syllable_next: true },
	{ timestamp: '01.35.350', syllable: true, syllable_next: true },
	{ timestamp: '01.35.589', syllable: true, syllable_next: true },
	{ timestamp: '01.35.835', syllable: true, syllable_next: true },
	{ timestamp: '01.36.030', syllable: true, syllable_next: true },
	{ timestamp: '01.36.494', syllable: true, syllable_next: true },
	{ timestamp: '01.36.730', syllable: true, syllable_next: true },
	{ timestamp: '01.36.962', syllable: true, syllable_next: true },
	{ timestamp: '01.37.418', syllable: true, syllable_next: true },
	{ timestamp: '01.37.877', syllable: true, syllable_next: true },
	{ timestamp: '01.38.115', syllable: true, syllable_next: true },
	{ timestamp: '01.38.575', syllable: true, syllable_next: true },
	{ timestamp: '01.38.807', syllable: true },
	{ timestamp: '01.39.050', word: 'don’t' },
	{ timestamp: '01.39.265', word: 'need' },

	{ timestamp: '01.39.487', next: true },

	{ timestamp: '01.39.727', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.40.211', syllable: true, syllable_next: true },
	{ timestamp: '01.40.420', syllable: true, syllable_next: true },
	{ timestamp: '01.40.650', syllable: true, syllable_next: true },
	{ timestamp: '01.41.111', syllable: true, syllable_next: true },
	{ timestamp: '01.41.570', syllable: true, syllable_next: true },
	{ timestamp: '01.41.794', syllable: true, syllable_next: true },
	{ timestamp: '01.42.506', syllable: true },
	{ timestamp: '01.42.725', word: 'don’t' },
	{ timestamp: '01.42.956', word: 'need' },

	{ timestamp: '01.43.100', next: true },

	{ timestamp: '01.43.415', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.43.911', syllable: true, syllable_next: true },
	{ timestamp: '01.44.114', syllable: true, syllable_next: true },
	{ timestamp: '01.44.339', syllable: true, syllable_next: true },
	{ timestamp: '01.44.803', syllable: true, syllable_next: true },
	{ timestamp: '01.45.264', syllable: true, syllable_next: true },
	{ timestamp: '01.45.508', syllable: true, syllable_next: true },
	{ timestamp: '01.46.190', syllable: true },
	{ timestamp: '01.46.444', word: 'don’t' },
	{ timestamp: '01.46.646', word: 'need' },

	{ timestamp: '01.46.800', next: true },

	{ timestamp: '01.47.107', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.47.575', syllable: true, syllable_next: true },
	{ timestamp: '01.47.801', syllable: true, syllable_next: true },
	{ timestamp: '01.48.030', syllable: true, syllable_next: true },
	{ timestamp: '01.48.496', syllable: true, syllable_next: true },
	{ timestamp: '01.48.954', syllable: true, syllable_next: true },
	{ timestamp: '01.49.191', syllable: true },

	{ timestamp: '01.49.628', next: true },

	// START OF VERSE AGAIN

	{ timestamp: '01.50.091', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.50.370', syllable: true, syllable_next: true },
	{ timestamp: '01.50.597', syllable: true, syllable_next: true },
	{ timestamp: '01.50.800', syllable: true, syllable_next: true },
	{ timestamp: '01.51.263', syllable: true, syllable_next: true },
	{ timestamp: '01.51.511', syllable: true, syllable_next: true },
	{ timestamp: '01.51.723', syllable: true },
	{ timestamp: '01.51.896', word: 'don’t' },
	{ timestamp: '01.52.188', word: 'need' },
	{ timestamp: '01.53.350', word: 'a' },
	{ timestamp: '01.53.569', word: 'safe' },
	{ timestamp: '01.54.031', word: 'word' },

	{ timestamp: '01.54.493', next: true },

	{ timestamp: '01.55.200', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.55.322', syllable: true, syllable_next: true },
	{ timestamp: '01.55.415', syllable: true },
	{ timestamp: '01.55.676', word: 'don’t' },
	{ timestamp: '01.55.878', word: 'want' },
	{ timestamp: '01.56.118', word: 'to' },
	{ timestamp: '01.56.339', word: 'be' },
	{ timestamp: '01.56.800', word: 'able', syllable_next: true },
	{ timestamp: '01.57.043', syllable: true },
	{ timestamp: '01.57.261', word: 'to' },
	{ timestamp: '01.57.526', word: 'be' },
	{ timestamp: '01.57.724', word: 'heard' },

	{ timestamp: '01.58.000', next: true },

	{ timestamp: '01.58.403', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '01.58.902', syllable: true, syllable_next: true },
	{ timestamp: '01.59.107', syllable: true },
	{ timestamp: '01.59.321', word: 'don’t' },
	{ timestamp: '01.59.569', word: 'need' },
	{ timestamp: '01.59.786', word: 'my' },
	{ timestamp: '02.00.031', word: 'hands' },
	{ timestamp: '02.00.737', word: 'to' },
	{ timestamp: '02.00.953', word: 'be' },
	{ timestamp: '02.01.416', word: 'free' },

	{ timestamp: '02.02.091', next: true },

	{ timestamp: '02.02.801', word: 'I', line_start: true },
	{ timestamp: '02.02.994', word: 'don’t' },
	{ timestamp: '02.03.276', word: 'want' },
	{ timestamp: '02.03.545', word: 'it' },
	{ timestamp: '02.03.908', word: 'to' },
	{ timestamp: '02.04.196', word: 'be' },
	{ timestamp: '02.04.691', word: 'easy', syllable_next: true },
	{ timestamp: '02.05.190', syllable: true },

	{ timestamp: '02.05.300', next: true },

	// VERSE ONE MORE TIME

	{ timestamp: '02.05.568', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '02.06.030', syllable: true, syllable_next: true },
	{ timestamp: '02.06.263', syllable: true, syllable_next: true },
	{ timestamp: '02.06.495', syllable: true },
	{ timestamp: '02.06.675', word: 'don’t' },
	{ timestamp: '02.06.953', word: 'need' },
	{ timestamp: '02.08.125', word: 'a' },
	{ timestamp: '02.08.341', word: 'safe' },
	{ timestamp: '02.08.799', word: 'word' },

	{ timestamp: '02.09.252', next: true },

	{ timestamp: '02.09.959', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '02.10.091', syllable: true, syllable_next: true },
	{ timestamp: '02.10.191', syllable: true },
	{ timestamp: '02.10.399', word: 'don’t' },
	{ timestamp: '02.10.647', word: 'want' },
	{ timestamp: '02.10.873', word: 'to' },
	{ timestamp: '02.11.108', word: 'be' },
	{ timestamp: '02.11.568', word: 'able', syllable_next: true },
	{ timestamp: '02.11.810', syllable: true },
	{ timestamp: '02.12.030', word: 'to' },
	{ timestamp: '02.12.250', word: 'be' },
	{ timestamp: '02.12.492', word: 'heard' },

	{ timestamp: '02.12.728', next: true },

	{ timestamp: '02.13.183', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '02.13.646', syllable: true, syllable_next: true },
	{ timestamp: '02.13.883', syllable: true },
	{ timestamp: '02.14.099', word: 'don’t' },
	{ timestamp: '02.14.340', word: 'need' },
	{ timestamp: '02.14.571', word: 'my' },
	{ timestamp: '02.14.801', word: 'hands' },
	{ timestamp: '02.15.506', word: 'to' },
	{ timestamp: '02.15.727', word: 'be' },
	{ timestamp: '02.16.185', word: 'free' },

	{ timestamp: '02.16.887', next: true },

	{ timestamp: '02.17.572', word: 'I', line_start: true },
	{ timestamp: '02.17.761', word: 'don’t' },
	{ timestamp: '02.18.031', word: 'want' },
	{ timestamp: '02.18.269', word: 'it' },
	{ timestamp: '02.18.610', word: 'to' },
	{ timestamp: '02.18.954', word: 'be' },
	{ timestamp: '02.19.472', word: 'easy', syllable_next: true },
	{ timestamp: '02.19.919', syllable: true },

	{ timestamp: '02.20.114', next: true },

	// ALL i's FOR A WHILE, THEN THE BREAKDOWN

	{ timestamp: '02.20.338', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '02.20.569', syllable: true, syllable_next: true },
	{ timestamp: '02.20.800', syllable: true, syllable_next: true },
	{ timestamp: '02.21.033', syllable: true, syllable_next: true },
	{ timestamp: '02.21.263', syllable: true, syllable_next: true },
	{ timestamp: '02.21.726', syllable: true, syllable_next: true },
	{ timestamp: '02.21.954', syllable: true, syllable_next: true },
	{ timestamp: '02.22.189', syllable: true, syllable_next: true },
	{ timestamp: '02.22.415', syllable: true, syllable_next: true },
	{ timestamp: '02.23.104', syllable: true, syllable_next: true },
	{ timestamp: '02.23.566', syllable: true, syllable_next: true },
	{ timestamp: '02.23.804', syllable: true, syllable_next: true },
	{ timestamp: '02.24.030', syllable: true, syllable_next: true },
	{ timestamp: '02.24.491', syllable: true, syllable_next: true },
	{ timestamp: '02.24.729', syllable: true, syllable_next: true },
	{ timestamp: '02.24.960', syllable: true, syllable_next: true },
	{ timestamp: '02.25.417', syllable: true, syllable_next: true },
	{ timestamp: '02.25.649', syllable: true, syllable_next: true },
	{ timestamp: '02.25.877', syllable: true, syllable_next: true },
	{ timestamp: '02.26.108', syllable: true, syllable_next: true },
	{ timestamp: '02.26.799', syllable: true, syllable_next: true },
	{ timestamp: '02.27.016', word: 'don’t' },
	{ timestamp: '02.27.267', word: 'need' },

	{ timestamp: '02.27.504', next: true },

	{ timestamp: '02.27.723', word: 'I', line_start: true, syllable_next: true },
	{ timestamp: '02.27.957', syllable: true, syllable_next: true },
	{ timestamp: '02.28.190', syllable: true, syllable_next: true },
	{ timestamp: '02.28.646', syllable: true, syllable_next: true },
	{ timestamp: '02.29.112', syllable: true, syllable_next: true },
	{ timestamp: '02.29.340', syllable: true, syllable_next: true },
	{ timestamp: '02.29.572', syllable: true, syllable_next: true },
	{ timestamp: '02.30.028', syllable: true, syllable_next: true },
	{ timestamp: '02.30.490', syllable: true, syllable_next: true },
	{ timestamp: '02.30.953', syllable: true, syllable_next: true },
	{ timestamp: '02.31.157', syllable: true, syllable_next: true },
	{ timestamp: '02.31.416', syllable: true, syllable_next: true },
	{ timestamp: '02.31.648', syllable: true, syllable_next: true },
	{ timestamp: '02.31.879', syllable: true, syllable_next: true },
	{ timestamp: '02.32.108', syllable: true, syllable_next: true },
	{ timestamp: '02.32.338', syllable: true, syllable_next: true },
	{ timestamp: '02.32.573', syllable: true, syllable_next: true },
	{ timestamp: '02.32.800', syllable: true, syllable_next: true },
	{ timestamp: '02.33.029', syllable: true, syllable_next: true },
	{ timestamp: '02.33.259', syllable: true, syllable_next: true },
	{ timestamp: '02.33.304', syllable: true, syllable_next: true },
	{ timestamp: '02.33.379', syllable: true, syllable_next: true },
	{ timestamp: '02.33.466', syllable: true, syllable_next: true },
	{ timestamp: '02.33.607', syllable: true, syllable_next: true },
	{ timestamp: '02.33.725', syllable: true, syllable_next: true },
	{ timestamp: '02.33.852', syllable: true, syllable_next: true },
	{ timestamp: '02.33.961', syllable: true, syllable_next: true },
	{ timestamp: '02.34.071', syllable: true, syllable_next: true },
	{ timestamp: '02.34.194', syllable: true, syllable_next: true },
	{ timestamp: '02.34.417', syllable: true },

	{ timestamp: '02.34.652', next: true },

	// ========================================================================
	//  BREAKDOWN      BREAKDOWN      BREAKDOWN      BREAKDOWN      BREAKDOWN
	// ========================================================================

	// Hot wax
	// Make it pop
	// Slow drip
	// Make the body, AH
	// Cold steel
	// Keep it locked
	// Mouth shut
	// Get rocked

	{ timestamp: '02.35.108', word: 'Hot', line_start: true },
	{ timestamp: '02.35.579', word: 'wax' },
	{ timestamp: '02.36.037', word: 'make' },
	{ timestamp: '02.36.191', word: 'it' },
	{ timestamp: '02.36.496', word: 'pop' },

	{ timestamp: '02.36.745', next: true },

	{ timestamp: '02.37.126', word: 'Slow', line_start: true },
	{ timestamp: '02.37.398', word: 'drip' },
	{ timestamp: '02.37.645', word: 'make' },
	{ timestamp: '02.37.765', word: 'the' },
	{ timestamp: '02.37.872', word: 'body,', syllable_next: true },
	{ timestamp: '02.37.992', syllable: true },
	{ timestamp: '02.38.348', word: 'ah' },

	{ timestamp: '02.38.571', next: true },

	{ timestamp: '02.38.804', word: 'Cold', line_start: true },
	{ timestamp: '02.39.187', word: 'steel' },
	{ timestamp: '02.39.702', word: 'keep' },
	{ timestamp: '02.39.880', word: 'it' },
	{ timestamp: '02.40.190', word: 'locked' },

	{ timestamp: '02.40.418', next: true },

	{ timestamp: '02.40.851', word: 'Mouth', line_start: true },
	{ timestamp: '02.41.063', word: 'shut' },
	{ timestamp: '02.41.559', word: 'get' },
	{ timestamp: '02.42.036', word: 'rocked' },

	{ timestamp: '02.42.260', next: true },

	// AGAIN

	{ timestamp: '02.42.493', word: 'Hot', line_start: true },
	{ timestamp: '02.43.004', word: 'wax' },
	{ timestamp: '02.43.427', word: 'make' },
	{ timestamp: '02.43.550', word: 'it' },
	{ timestamp: '02.43.880', word: 'pop' },

	{ timestamp: '02.44.107', next: true },

	{ timestamp: '02.44.532', word: 'Slow', line_start: true },
	{ timestamp: '02.44.798', word: 'drip' },
	{ timestamp: '02.45.005', word: 'make' },
	{ timestamp: '02.45.148', word: 'the' },
	{ timestamp: '02.45.259', word: 'body,', syllable_next: true },
	{ timestamp: '02.45.412', syllable: true },
	{ timestamp: '02.45.728', word: 'ah' },

	{ timestamp: '02.45.950', next: true },

	{ timestamp: '02.46.190', word: 'Cold', line_start: true },
	{ timestamp: '02.46.569', word: 'steel' },
	{ timestamp: '02.47.097', word: 'keep' },
	{ timestamp: '02.47.256', word: 'it' },
	{ timestamp: '02.47.571', word: 'locked' },

	{ timestamp: '02.47.916', next: true },

	{ timestamp: '02.48.232', word: 'Mouth', line_start: true },
	{ timestamp: '02.48.492', word: 'shut' },
	{ timestamp: '02.48.997', word: 'get' },
	{ timestamp: '02.49.450', word: 'rocked' },

	// todo: visual effect here?
	{ timestamp: '02.50.730', next: true },

	// AGAIN AGAIN

	{ timestamp: '02.51.723', word: 'Hot', line_start: true },
	{ timestamp: '02.52.244', word: 'wax' },
	{ timestamp: '02.52.656', word: 'make' },
	{ timestamp: '02.52.788', word: 'it' },
	{ timestamp: '02.53.107', word: 'pop' },

	{ timestamp: '02.53.337', next: true },

	{ timestamp: '02.53.762', word: 'Slow', line_start: true },
	{ timestamp: '02.54.001', word: 'drip' },
	{ timestamp: '02.54.261', word: 'make' },
	{ timestamp: '02.54.372', word: 'the' },
	{ timestamp: '02.54.478', word: 'body,', syllable_next: true },
	{ timestamp: '02.54.567', syllable: true },
	{ timestamp: '02.54.956', word: 'ah' },

	{ timestamp: '02.55.180', next: true },

	{ timestamp: '02.55.417', word: 'Cold', line_start: true },
	{ timestamp: '02.55.787', word: 'steel' },
	{ timestamp: '02.56.330', word: 'keep' },
	{ timestamp: '02.56.489', word: 'it' },
	{ timestamp: '02.56.803', word: 'locked' },

	{ timestamp: '02.57.034', next: true },

	{ timestamp: '02.57.456', word: 'Mouth', line_start: true },
	{ timestamp: '02.57.673', word: 'shut' },
	{ timestamp: '02.58.194', word: 'get' },
	{ timestamp: '02.58.655', word: 'rocked' },

	{ timestamp: '02.58.879', next: true },

	// AGAAAAAINNNNNNNNNN

	{ timestamp: '02.59.108', word: 'Hot', line_start: true },
	{ timestamp: '02.59.606', word: 'wax' },
	{ timestamp: '03.00.053', word: 'make' },
	{ timestamp: '03.00.161', word: 'it' },
	{ timestamp: '03.00.495', word: 'pop' },

	{ timestamp: '03.00.724', next: true },

	{ timestamp: '03.01.157', word: 'Slow', line_start: true },
	{ timestamp: '03.01.362', word: 'drip' },
	{ timestamp: '03.01.619', word: 'make' },
	{ timestamp: '03.01.756', word: 'the' },
	{ timestamp: '03.01.875', word: 'body,', syllable_next: true },
	{ timestamp: '03.01.955', syllable: true },
	{ timestamp: '03.02.350', word: 'ah' },

	{ timestamp: '03.02.574', next: true },

	{ timestamp: '03.02.786', word: 'Cold', line_start: true },
	{ timestamp: '03.03.189', word: 'steel' },
	{ timestamp: '03.03.726', word: 'keep' },
	{ timestamp: '03.03.883', word: 'it' },
	{ timestamp: '03.04.191', word: 'locked' },

	{ timestamp: '03.04.420', next: true },

	{ timestamp: '03.04.636', word: 'Mouth', line_start: true },
	{ timestamp: '03.05.103', word: 'shut' },
	{ timestamp: '03.05.582', word: 'get' },
	{ timestamp: '03.06.064', word: 'rocked' },
	{ timestamp: '03.06.900', word: '&nbsp;', line_start: true },
	{ timestamp: '03.07.500', fade_sentences_out: true },

	// SHOUTY STUFF, MAYBE VISUAL STABS

]);

var last_time = 0;
var song_markers = timestamps.map(function(t, i) {
	var parts = t.timestamp.split('.');
	var time = +parts[0] * 60;
	time += +parts[1];
	time += (+parts[2] * 1/1000);
	t.time = time;
	if (t.time < last_time) {
		throw new Error(`OH NO there was a bad timestamp at ${t.timestamp}`);
	}
	t.index = i;
	last_time = t.time;
	return t;
});

// these will be consumed by the interface
var sentences = timestamps.reduce((groups, event) => {
	if (event.line_start) groups.push([]);
	if (event.word) groups[groups.length - 1].push(event.word);
	return groups;
}, []);

// ======================================================
// STRUCTURE CHANGES
// ======================================================

var song = new Bacon.Bus();
var ball_progress = new Bacon.Bus();

let state = {
	last: 0,
	next: 0,
	ts: 0
};

// this is the real one
audio.structure_stream.onValue( function(position) {
	if (position === 0) return;
	// find all actions between the last ts and this one
	let actions = find_actions_between(song_markers, state.ts, position);
	actions.forEach(a => song.push(a));
	state.ts = position;
	// song.push(find_action(song_markers, position));
	var progress = (state.ts - state.last) / state.length;
	ball_progress.push(progress);
});

// song.log();

var event_stream = song.skipDuplicates();

event_stream.onValue(event => {
	// if the event is `next`, no need to do anything further here
	if (!event || event.next) return;
	// the last word we hit is represented in this event.
	// grab this timestamp and look for the next event's timestamp.
	state.last = event.time;
	state.next = getNextTs(event.index);
	// if there is no next, we must be at the end
	if (!state.next) return;
	// the length is the amt of time until we hit the next ts.
	state.length = state.next - state.last;
});

function getNextTs(index) {
	// go through the song_markers but skip `next` events
	for (let i = 1; i < song_markers.length - index; i++) {
		if (!song_markers[index + i].next) return song_markers[index + i].time;
	}
	return null;
}

function find_action(arr, val) {
	for(var i = arr.length - 1; i >= 0; i--) {
		if(val >= arr[i].time) {
			return arr[i];
		}
	}
	return null;
}

function find_actions_between(arr, last, next) {
	// console.log('find_actions_between', last, next);
	return arr.filter(t => (next >= t.time && last <= t.time));
}

// event_stream.log();
// ball_progress.log();

module.exports = {
	event_stream,
	sentences,
	ball_progress
};