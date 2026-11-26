# Buzzworks

An idle honey tycoon. Tap the comb, build a hive empire, catch lucky bees and ticket bees, hatch a bee collection, equip hive cores, swarm for royal jelly, earn crowns and open new worlds.

## Running it

| Platform | How |
|---|---|
| Website | Hosted on GitHub Pages (see Publishing). Saves stay in the browser, with optional cloud save, leagues and rankings through Firebase. |
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
- **Crowns**: a coronation resets jelly and skills for crowns. Perks at 1, 2, 3, 5, 8, 12 and 20 crowns. **Hive mind** (automation) is late game: level 1 needs 20 crowns, level 2 needs 100, level 3 needs 500, and they cost 2 M, 200 M and 20 B royal jelly. A coronation resets it like every other queen skill.
- **Blessings**: at the start of each swarm and at 100 K, 1 B, 10 T and 100 Qa honey, pick 1 of 3 bonuses for the swarm. Reroll with an ad.
- **Tickets**: egg tickets (standard eggs), royal tickets (royal eggs) and core tickets (hive cores). There is no paid currency.
- **Bees tab**: the standard egg (egg tickets) and the royal egg (royal tickets, weekly featured limited bee, 50/50 with guarantee). Rates: standard 70 / 24 / 5.4 / 0.6 %, royal 78 / 19 / 3 % (rare, epic, legendary). Pity: legendary guaranteed within 120 standard or 80 royal hatches, an epic or better every 20 standard or 12 royal. Hatch 1, 10 or all your tickets at once (up to 500), and hatch again straight from the results. The bee collection is never reset.
- **Workshop tab**: core summoning (core tickets, rates 64 / 27 / 7.8 / 1.2 %, legendary within 100). 12 hive cores in 4 rarities, duplicates level them up. 2 core slots, a 3rd at level 20, a 4th and 5th from the Frost tree. Hive skins: 8 skins built from parts (4 to 8 parts each) plus the pass skin. Parts drop from treasure chests, lucky bees (5%), level rewards, the streak and the pass. Each owned skin gives +3% honey and the skin in use gives its own bonus.
- **Endless pass tier**: after tier 50, every 2,500 more pass XP gives 3 egg tickets and 5 minutes of double honey. It can be claimed again and again; Claim all takes every pending one.
- **Daily tab**: 7 day streak (10 to 20 egg tickets, core tickets, skin parts, 5 royal tickets and an epic bee on day 7), 3 daily quests (3 egg, 5 egg, 2 core tickets) and 2 quick tasks that renew every 15 minutes.
- **Hive pass**: free, resets every Monday, 50 tiers. Tier n needs 500 + 50 x (n - 1) XP (86,250 XP in total, about ten hours of active play). Rewards: 10 to 20 egg tickets on most tiers, 10 core tickets every 5 tiers, 5 royal tickets every 10, skin parts, boosts, the Sunflower field skin (tier 25) and the Sunflare bee (tier 50).
- **Trophies**: two parts. **Swarm goals** reset at every swarm and give tickets again (they are the main source of royal tickets). The **Hall of fame** is permanent, gives +2% honey per trophy and tickets once.
- **Player level**: every action gives XP. Each level gives 5 or more egg tickets, core tickets every 3 levels, a skin part every 4, royal tickets every 5 (5 royal and 5 core every 10) and +1% honey. Tabs unlock step by step: Daily 2, Bees 3, Workshop 5, League 5, Pass 6.
- **Worlds** (after the first crown): the Worlds tab opens a full-screen world map. Tap an island to see its honey per second, crowns, honey made and royal jelly, then travel there (a bee flies along the route), open it or sell it. Each world has its own twist and theme, and its own honey, queen and crowns. Crowns earned in a world open the next one. Bees, cores, skins, tickets and the level are shared.

| World | Cost | Twist |
|---|---|---|
| Flower meadow | | classic |
| Sun dunes | 100 crowns of the Flower meadow | prices rise more slowly, lucky bees rarer |
| Glacier hive | 150 crowns of the Sun dunes | half honey, triple away earnings, +6 h away, longer lucky effects |
| Moon garden | 200 crowns of the Glacier hive | lucky bees x2.2, weak taps |
| Ember peaks | 250 crowns of the Moon garden | double royal jelly, steeper prices |

- **Essence trees**: each world has its own essence (Bloom, Sun, Frost, Moon, Ember). Sell an open world with 5 crowns or more earned in it to restart it for that world's essence, then spend it in that world's tree (button on the world map). Every tree has 5 upgrades with a level cap (the fifth is a costly late node: Royal nectar, Regal bloodline, Frozen time, Ruby lure, Phoenix wings), so finishing them all means playing and selling every world.
- **Prime**: once all five trees are complete, spend 50 K of every essence (doubles each time) and one Prime stone to gain a Prime point. Honey x2 per point, stacking. Worlds, crowns, essence and trees restart from one fresh world; bees, cores, skins, tickets, level and pass stay.
- **Red lucky bees**: once worlds are open, 2% of lucky bees are red, up to 6% with the Ruby lure upgrade in the Moon tree. Catching one spins a reel: Prime stone 3%, 6 egg tickets 30%, 150 essence of the current world 25%, 3 royal tickets 15%, a skin part 15%, 2 core tickets 12%.
- **Mythic**: a fifth rarity above legendary. 3 mythic bees and 2 mythic cores, at 0.04% (standard egg), 0.2% (royal egg) and 0.1% (core summoning) per hatch, outside the pity system.
- **Stats tab**: every multiplier (honey, taps, lucky bees, royal jelly, prices, away time) broken down by source, plus general stats.
- **Ads**: optional rewarded ads for x2 honey for 30 min (6 a day), 2 egg tickets (3 a day), away earnings x2 (3 a day) and blessing rerolls (3 a day). The free Bee dance gives x2 for 20 min every 4 h.
- **League and rankings** (level 5, needs Firebase and Google sign-in): weekly groups of up to 20 real players and top 50 rankings.

Keyboard: `Space` or `Enter` taps the comb, `1` to `0` switch tabs, `Esc` closes dialogs.

## Online: cloud save, leagues and rankings (Firebase)

Sign in with Google, cloud saves, weekly leagues with real players and rankings all run on a free Firebase project (Spark plan, no card needed). Until `app/src/config.js` has a Firebase config, the League tab is hidden and saves stay in the browser.

1. Open https://console.firebase.google.com, Create a project (for example "buzzworks"). Google Analytics is not needed.
2. Project overview, the web icon `</>`: register an app (any nickname, no Firebase Hosting). Copy `apiKey`, `authDomain`, `projectId` and `appId` into `app/src/config.js`. These values are public by design; the security rules protect the data.
3. Build, Authentication, Get started, Sign-in method: enable **Google**. Then Settings, Authorized domains: add `buzzworks.novafox.fr` and `lukalaurent.github.io` (localhost is already there).
4. Build, Firestore Database, Create database, pick a location close to the players, start in **production mode**.
5. Firestore, Rules: replace everything with the content of `app/firebase/firestore.rules` and Publish.
6. Publish the game again.

What is stored: `saves/{uid}` (the player's save, private), `players/{uid}` (public name, level and ranking stats), `groups/{week_tier_n}` (league groups of up to 20 players with their weekly points). The game syncs every 3 minutes while signed in.

League quests: once in a group, each player gets 4 harder quests for the week (for example catch 15 ticket bees, hatch 40 eggs, get crowned twice, catch a red lucky bee) worth 150 to 400 league points each. Claiming one replaces it with a new quest right away, 20% harder for each quest already done that week. A What's new pill appears next to the About tab after each update (a banner above the promo on phones), until the player opens or closes it (changelog in BZ.CHANGELOG in data.js, also reachable from About).

Leagues: points only count once the player has joined this week's group, so nobody starts ahead. Points come from lucky bees, ticket bees, quests, quick tasks, swarms, milestones, upgrades, trophies and play time. Each week (Monday to Monday, local time) players join a group of up to 20 in their tier. When a new week starts, the top quarter moves up a tier and the bottom quarter moves down (groups of 4 or more). Rewards: egg tickets for everyone, royal tickets for the top 3, a core ticket on promotion. Rankings show the top 50 for honey made (all worlds), crowns, essence, bee species, level and trophies.

The game runs in the browser, so a determined player could send fake numbers. The rules cap values and point gains per update; obvious cheaters can be deleted from the Firestore console.

## CrazyGames version

`app/tools/build-crazygames.ps1` builds two zips in `dist/` (not committed) from the same code:

```
powershell -ExecutionPolicy Bypass -File app/tools/build-crazygames.ps1
```

- `buzzworks-crazygames-basic.zip`: for the first submission (Basic Launch). No ad buttons at all, since CrazyGames disables ads in Basic Launch.
- `buzzworks-crazygames-full.zip`: for Full Launch. Rewarded ads go through the CrazyGames SDK.

What the build changes: `src/config.js` gets `platform: 'crazygames'` with no Firebase and no AdSense, `index.html` loads the CrazyGames SDK v3 and `src/crazygames.js`, and `src/ads.js` and the AdSense tag are removed. In that mode the game:
- saves progress through the CrazyGames Data module (tick "Progress Save" when submitting), copying an existing browser save once;
- reports loading start and stop, gameplay start on Play, gameplay stop and start around ads, and a happy moment on coronations;
- follows the CrazyGames mute setting;
- hides Google sign-in, leagues, rankings and the player name (no outside logins allowed), and removes the NovaFox and GitHub links from About (no links to a playable copy elsewhere);
- always starts in English (CrazyGames requires English as the default language); French stays available in Settings.

Rewarded ads only grant their reward when the ad finishes, and their buttons disappear when ads are disabled or blocked.

## Publishing on GitHub Pages

`app/tools/publish.ps1` signs in to GitHub if needed, creates the public repository `buzzworks`, commits, pushes and turns on GitHub Pages. The workflow in `.github/workflows/pages.yml` publishes the `app` folder on every push to `main`. The game lives at https://buzzworks.novafox.fr (DNS: CNAME `buzzworks` to `lukalaurent.github.io` at IONOS, custom domain set in the repository Pages settings). The old github.io address redirects there. Saves and logs (`data/`, `logs/`) are never committed.

```
powershell -ExecutionPolicy Bypass -File app/tools/publish.ps1 -Message "What changed"
```

## Project layout

```
Buzzworks.cmd        launcher (project root)
app/index.html       page shell and loading screen
app/css/style.css    styles, brand tokens at the top
app/src/config.js    site settings (Firebase config)
app/src/data.js      balance numbers: producers, upgrades, skills, lucky effects, skins, cores, worlds, trophies, banners
app/src/engine.js    game rules: production, buying, taps, lucky and ticket bees, swarm, coronation, offline, automation, trophies
app/src/meta.js      streak, daily quests, quick tasks, hidden league
app/src/progress.js  tickets, hatching, cores, skin parts, level, pass, blessings, ads limits, worlds and essence
app/src/cloud.js     Firebase sign-in, cloud save, rankings and league groups
app/src/online.js    profile, weekly league sync and rankings
app/src/ui3.js       league and rankings screens
app/src/ui4.js       stats tab and about page
app/src/worldmap.js  full-screen world map and essence tree
app/firebase/        Firestore security rules
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
app/tools/build-crazygames.ps1  CrazyGames zips
app/src/crazygames.js  CrazyGames SDK adapter (CrazyGames build only)
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
- Fonts: the page loads Poppins and Inter from Google Fonts with system fallbacks. Bundle the font files in `app/assets/fonts` for offline use.
