# Buzzworks

An idle honey tycoon. Tap the comb, build a hive empire, catch lucky bees and ticket bees, hatch a bee collection, equip hive cores, swarm for royal jelly, earn crowns and open new worlds.

## Running it

| Platform | How |
|---|---|
| Website | Hosted on GitHub Pages (see Publishing). Saves stay in the browser, with optional Google Drive cloud save. |
| Windows | Double click `Buzzworks.cmd` in the project folder. It starts a small local server (port 5190, needs Node.js) and opens the game in an app window (Edge or Chrome) or in the default browser. The server stops by itself 5 minutes after the game is closed. |
| Any static host | Serve the `app` folder as is. No build step. |
| Android (later) | Wrap the `app` folder with Capacitor (see below). |

With the local server, saves go to `data/save.json` and `data/settings.json`, with a copy in the browser storage, and logs go to `logs/`. On a website, saves stay in the browser storage only.

## Gameplay

- **Tap the comb** for honey. Fast taps build a combo, up to x2 (more with Rhythm, cores and blessings).
- **Producers**: 20 of them, from Worker bee to Infinite comb. Every producer doubles its honey at 25, 50, 100, 150, 200 owned and then every 50.
- **Upgrades** unlock as the hive grows: producer x2, links between neighbours, tap, lucky bee and global x1.5 upgrades.
- **Colony level**: owning at least 1, 25, 50, 100... of every producer gives x1.5 to everything.
- **Lucky bees** fly by every 1.5 to 3 minutes: honey rush (x7, rarer than before), lucky harvest, honey storm, tap frenzy, ticket shower (2 egg tickets) or treasure chest (a skin part and an egg ticket).
- **Ticket bees** fly by every 3 to 6 minutes carrying an egg ticket (sometimes 2, sometimes a core ticket). There is also a small chance each minute to find an egg ticket, and a few tickets are found after long absences.
- **Queen** (opens when the hive gets close to its first swarm): swarm to reset the run for royal jelly, buy queen skills, pick blessings.
- **Crowns**: a coronation resets jelly and skills for crowns. Perks at 1, 2, 3, 5, 8, 12 and 20 crowns. The Hive mind automation skill needs 5 crowns.
- **Blessings**: at the start of each swarm and at 100 K, 1 B, 10 T and 100 Qa honey, pick 1 of 3 bonuses for the swarm. Reroll with an ad.
- **Tickets**: egg tickets (standard eggs), royal tickets (royal eggs) and core tickets (hive cores). There is no paid currency.
- **Bees tab**: the standard egg (egg tickets) and the royal egg (royal tickets, weekly featured limited bee, 50/50 with guarantee). Pity: legendary guaranteed within 60 standard or 40 royal hatches, an epic or better every 10. The bee collection is never reset.
- **Workshop tab**: core summoning (core tickets, legendary within 50). 12 hive cores in 4 rarities, duplicates level them up. 2 core slots, a 3rd at level 20, a 4th with 5 essence. Hive skins: 8 skins built from parts (4 to 8 parts each) plus the pass skin. Parts drop from treasure chests, lucky bees (5%), level rewards, the streak and the pass. Each owned skin gives +3% honey and the skin in use gives its own bonus.
- **Daily tab**: 7 day streak (tickets and skin parts, an epic bee on day 7), 3 daily quests (egg, egg, core tickets) and 2 quick tasks that renew every 15 minutes (4 minutes of honey and an egg ticket, a core ticket every 8 tasks).
- **Hive pass**: free, 28 day season, 30 tiers. Tickets, skin parts, boosts, the Sunflower field skin (tier 20) and the Sunflare bee (tier 30).
- **Trophies**: two parts. **Swarm goals** reset at every swarm and give tickets again (they are the main source of royal tickets). The **Hall of fame** is permanent, gives +2% honey per trophy and tickets once.
- **Player level**: every action gives XP. Each level gives tickets (core every 3, part every 4, royal every 5) and +1% honey. Tabs unlock step by step: Daily 2, Bees 3, Workshop 5, Pass 6.
- **Worlds** (after the first crown): spend crowns to open the next world. Each world has its own twist and theme, and its own honey, queen and crowns. Bees, cores, skins, tickets and the level are shared.

| World | Cost | Twist |
|---|---|---|
| Flower meadow | | classic |
| Sun dunes | 10 crowns | prices rise more slowly, lucky bees rarer |
| Glacier hive | 15 crowns | half honey, triple away earnings, +6 h away, longer lucky effects |
| Moon garden | 20 crowns | lucky bees x2.2, weak taps |
| Ember peaks | 25 crowns | double royal jelly, steeper prices |

- **Essence**: sell a world (5 crowns or more earned in it) to restart it from zero for essence. Essence gives +12% honey and +3% royal jelly per point in every world, and perks at 5, 15, 40, 80 and 150.
- **Ads**: optional rewarded ads for x2 honey for 30 min (6 a day), 2 egg tickets (3 a day), away earnings x2 (3 a day) and blessing rerolls (3 a day). The free Bee dance gives x2 for 20 min every 4 h.
- **No ads**: the only paid item (1.99), shown as coming soon until a payment provider is plugged in.

Keyboard: `Space` or `Enter` taps the comb, `1` to `0` switch tabs, `Esc` closes dialogs.

## Google cloud save

The game can save to a private app folder in the player's own Google Drive. It needs a free OAuth client ID, which only the site owner can create:

1. Open https://console.cloud.google.com, create a project (for example "Buzzworks").
2. APIs and services, Library: enable **Google Drive API**.
3. APIs and services, OAuth consent screen: choose External, fill the app name, support email and developer email. Add the scope `https://www.googleapis.com/auth/drive.appdata`. Publish the app (this scope does not need a review).
4. APIs and services, Credentials, Create credentials, OAuth client ID, type **Web application**. Under Authorized JavaScript origins add `https://YOUR-GITHUB-NAME.github.io` and `http://localhost:5190`.
5. Copy the client ID into `app/src/config.js` (`googleClientId: '...apps.googleusercontent.com'`) and publish again.

Until a client ID is set, the Settings tab says cloud save is not set up and the game saves in the browser only. When signed in, the game syncs every 3 minutes. Google tokens last one hour, and the game asks Google again (without a password) when the player presses Play on the loading screen.

## Publishing on GitHub Pages

`app/tools/publish.ps1` signs in to GitHub if needed, creates the public repository `buzzworks`, commits, pushes and turns on GitHub Pages. The workflow in `.github/workflows/pages.yml` publishes the `app` folder at `https://YOUR-GITHUB-NAME.github.io/buzzworks/` on every push to `main`. Saves and logs (`data/`, `logs/`) are never committed.

```
powershell -ExecutionPolicy Bypass -File app/tools/publish.ps1 -Message "What changed"
```

## Project layout

```
Buzzworks.cmd        launcher (project root)
app/index.html       page shell and loading screen
app/css/style.css    styles, brand tokens at the top
app/src/config.js    site settings (Google client ID)
app/src/data.js      balance numbers: producers, upgrades, skills, lucky effects, skins, cores, worlds, trophies, banners
app/src/engine.js    game rules: production, buying, taps, lucky and ticket bees, swarm, coronation, offline, automation, trophies
app/src/meta.js      streak, daily quests, quick tasks, hidden league
app/src/progress.js  tickets, hatching, cores, skin parts, level, pass, blessings, ads limits, worlds and essence
app/src/cloud.js     Google Drive cloud save
app/src/ui.js        pages, HUD, dialogs, toasts
app/src/ui2.js       pass, workshop, worlds, hatchery, blessing, level and ad screens, promo banners, extra text
app/src/scene.js     animated hive (canvas)
app/src/main.js      boot, main loop, saving, events
app/src/i18n.js      English and French text
app/src/format.js    number, time and date formatting
app/src/storage.js   saves (local server or browser storage), logs
app/src/audio.js     synthesized sounds and music (no audio files)
app/src/icons.js     inline icons and the app icon
app/tools/serve.js   local server with save and log endpoints
app/tools/sim.js     balance simulator: node app/tools/sim.js hours=12 dt=1
app/tools/publish.ps1  GitHub publishing
```

Plain JavaScript, no build step, no dependencies.

## Balance simulator

`node app/tools/sim.js hours=12 dt=1 log=3600 swarm=2 taps=3 active=0.35 world=0` plays the game with a greedy buyer and prints progress.

## Android with Capacitor

```
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init Buzzworks com.buzzworks.game --web-dir app
npx cap add android
npx cap open android
```

Hooks ready for platform features:
- Rewarded ads: define `window.BZ_ADS = { show(placement) }` returning a promise of `true` when the reward is earned (AdMob on Android, AdSense H5 game ads on the web). Without it, a 4 second placeholder is shown. Placements: boost, ticket, offline, reroll.
- No ads purchase: define `window.BZ_BILLING = { buy('noads') }` returning a promise of `{ ok: true }`. The button stays "coming soon" until the hook exists. Check purchases on a server before trusting them.
- Fonts: the page loads Poppins and Inter from Google Fonts with system fallbacks. Bundle the font files in `app/assets/fonts` for offline use.
