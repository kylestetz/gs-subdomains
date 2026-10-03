// Every album site served by this app.
//
//   id        — the subdomain the site lives on (<id>.grindselect.com), the folder
//               under sites/ holding its static files, and the `album` field on
//               its codes in the database.
//   download  — file name inside DOWNLOADS_DIR handed to anyone with a valid code.
//   legacyDb  — the per-album Mongo database the old promocodes app used; only
//               read by scripts/migrate.js.
export default [
	{ id: 'cola', download: 'GS015-ABeaconSchool-Cola-(ExpandedVinylEdition).zip', legacyDb: 'cola' },
	{ id: 'fossilillies', download: 'GS020-SonStep-Fossilillies.zip', legacyDb: 'fossilillies_ids' },
	{ id: 'maranasati', download: 'GS022-NinaKeith-MARANASATI-19111.zip', legacyDb: 'nina_keith' },
	{ id: 'mirage', download: 'GS028-PineBarons-Mirage-on-the-Meadow.zip', legacyDb: 'mirage_ids' },
	{ id: 'pare', download: 'ParksBurton-Pare-320mp3.zip', legacyDb: 'pare_ids' },
	{ id: 'safeword', download: 'cleanhouse.zip', legacyDb: 'safeword' },
	{ id: 'slagroom', download: 'slagroom.zip', legacyDb: 'abag_slagroom' },
	{ id: 'theacchinbook', download: 'PineBarons-TheAcchinBook-320mp3.zip', legacyDb: 'pine_barons_ids' },
	{ id: 'troubleshooting', download: 'troubleshooting.zip', legacyDb: 'abag_troubleshooting' },
];
