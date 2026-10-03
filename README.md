# gs-code-factory

The download-code sites for Grind Select records. Each vinyl record comes with a
download code; buyers go to the album's site (`<album>.grindselect.com`), enter
it, and get the album as a ZIP.

All nine album sites are served by one small Node process with one MongoDB
collection.

| Album | Site | Code page |
| --- | --- | --- |
| A Beacon School — Cola | `cola` | `/` |
| Son Step — Fossilillies | `fossilillies` | `/` |
| Nina Keith — MARANASATI 19111 | `maranasati` | `/` |
| Pine Barons — Mirage on the Meadow | `mirage` | `/` |
| Parks Burton — Pare | `pare` | `/` |
| Moon Bounce — Safe Word | `safeword` | `/` (scroll down) |
| all boy/all girl — Slagroom | `slagroom` | `/download` |
| Pine Barons — The Acchin Book | `theacchinbook` | `/` |
| all boy/all girl — Troubleshooting | `troubleshooting` | `/` |

## How it works

- **`albums.js`** lists every album: its subdomain, its ZIP, and the database it
  used before the merge.
- **`server/`** is an Express app. It works out the album from the request's
  subdomain, serves that album's static site from `sites/<album>/public`, and
  handles codes:
  - `POST /api/redeem` `{ code }` redeems a code and responds with
    `{ download: "/download/<CODE>" }`, or `{ error }` (`does_not_exist`,
    `expired`, `too_many_attempts`, `unavailable`).
  - `GET /download/<CODE>` redeems the code and sends the ZIP in one go. Old
    download links keep working. `HEAD` requests never use up a code.
- **`sites/`** holds the front ends. Seven albums share one layout
  (`sites/shared/base.css`) and one code form (`sites/shared/code-input.js`); each
  has its own `index.html` and a `theme.css` of colors. Slagroom and Safeword are
  their own interactive pieces, built from `sites/<album>/src` by `npm run build`.

### Redeeming codes

Entering a code redeems it and starts the download immediately. The code then
keeps working for 24 hours (`DOWNLOAD_WINDOW_HOURS`), so a failed or interrupted
download can be retried. In the old app the first request used the code up, and
the logs show people locked out after a download failed or their browser
requested the file twice. Set `DOWNLOAD_WINDOW_HOURS=0` to make codes strictly
single-use again.

Codes are case-insensitive. `permanent` codes never run out. If the ZIP for an
album is missing, codes are refused with "unavailable" and are **not** used up.

An IP that enters 20 wrong codes in 10 minutes is locked out of redeeming for the
rest of that window. Some albums have 3-character codes, which are easy to guess
without this.

## Development

Requires Node 24 (`nvm use`) and a local MongoDB.

```bash
npm install
cp .env.example .env
npm run build
npm run migrate -- path/to/mongodump
npm run dev
```

Then open <http://cola.localhost:3000> (browsers resolve any `*.localhost` to
your machine). Use `npm run build:watch` when working on Slagroom or Safeword.

Files that aren't in git:

- `downloads/` holds the album ZIPs named in `albums.js`.
- `sites/slagroom/public/audio/threnody.mp3`,
  `sites/safeword/public/audio/safeword.mp3` and
  `sites/safeword/public/audio/safeword_karaoke.mp3` are the full-length audio
  for those two experiences.

Run the tests (they use a throwaway `gs_codes_test` database):

```bash
npm test
```

## Managing codes

`npm run codes` replaces the old `promocodes` tasks:

```bash
npm run codes -- stats                          # codes and redemptions per album
npm run codes -- info cola ABC123               # a code and its history
npm run codes -- reset cola ABC123              # make a used code work again
npm run codes -- add cola FRIEND --limit 5      # hand-made code; --permanent for no limit
npm run codes -- generate cola 1000 > codes.txt # new codes for a pressing
npm run codes -- export cola > cola.csv         # every code with its status
```

Generated codes are six characters long and skip 0/O and 1/I/L, so they're easy
to read off a card.

## Adding an album

1. Add an entry to `albums.js`.
2. Copy `sites/cola` to `sites/<id>`, then replace the cover, the text in
   `index.html` and the colors in `theme.css`.
3. Put the ZIP in `downloads/`.
4. `npm run codes -- generate <id> 1000 > codes.txt` and send `codes.txt` to the
   printer.
5. Point `<id>.grindselect.com` at the server (see below).

## Deploying

The server needs:

- **Node 24.**
- **MongoDB 4.4 or newer.** The current VPS runs MongoDB 2.x, which the MongoDB
  driver no longer supports, so it has to be upgraded or replaced first. Other
  databases on that server (`gifts`, `grind-ids`, `pearly_ids`, `rugs`) aren't
  used by this app.
- The album ZIPs in `DOWNLOADS_DIR`, and the Slagroom/Safeword audio.

```bash
npm ci
npm run build
npm prune --omit=dev
npm start
```

Run it as a single service (systemd, pm2, …) on one port, and route every album
subdomain to it from nginx:

```nginx
server {
	listen 80;
	server_name cola.grindselect.com fossilillies.grindselect.com
		maranasati.grindselect.com mirage.grindselect.com pare.grindselect.com
		safeword.grindselect.com slagroom.grindselect.com
		theacchinbook.grindselect.com troubleshooting.grindselect.com;

	client_max_body_size 1k;

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

The app trusts `X-Forwarded-*` headers from loopback only (`TRUST_PROXY`), so the
rate limit sees each buyer's real IP behind nginx.

### Cutover

1. Take a fresh `mongodump` of the old server just before switching over, so no
   recent redemptions are lost.
2. `npm run migrate -- <dump dir>` imports the nine old databases into the
   `codes` collection. It won't run against a collection that already has codes
   unless you pass `--drop`.
3. Switch nginx over to the new app and stop the nine old processes.

The migration also cleans up some old data:

- Two codes stored as numbers (`cola` 123456, `fossilillies` 623585) and one in
  lower case (`cola` a0a0a0) could never be redeemed before. They now work.
- Codes created from Slack had a broken count (`NaN`), so they never expired. Their
  count is rebuilt from their history. `cola` A98765 and `slagroom` A0F820 had
  already been used, so they now show as used up.
