# Massive Random Game Picker

Derived from https://github.com/LukeIrvin26/random-game-picker

Simple node.JS script to fetch a random game from MobyGames, RAWG.io API or IGDB.com

MobyGames is given priority because the sort and research functions are better. IGDB.com comes up slightly less often. Both of these weight slightly toward well-known titles. RAWG will rarely pop up for real obscure picks.
Make sure you have [NodeJS](https://nodejs.org/en/) installed.

To start getting random games, do the following:

1. Run `npm install axios`
2. Run `npm install open`
3. Run `npm install weighted-random`
4. Run `npm install express`
5. [Sign up](https://dev.twitch.tv/login) for a Twitch account if you do not already have one, otherwise, login.
6. [Enable Two Factor](https://www.twitch.tv/settings/security) auth on your Twitch account.
7. [Register](https://dev.twitch.tv/console/apps/create) an application for your gamepicker app.
   1. OAuth Redirect URLs can just be http://localhost.
   2. Category can be `Application Integration`
8. Once registered, [manage](https://dev.twitch.tv/console/apps) your application you just created
9. Generate a Client Secret.
11. Open `gamepicker.mjs` and change the constants `twitchClientID` and `twitchClientSecret` to reflect the client ID and the client secret you generated. These can both be found on the screen that you generated the secret on in Step 9.
12. Likewise, change the constant `mobyApiKey` to reflect the API key you requested from MobyGames. You will need to create an Account, view your Profile, and click the "API" link.
13. Likewise, change the constant `rawgApiKey` to reflect the API key you requested from RAWG.io. The process is similar to that of MobyGames.
14. Run `node gamepicker.mjs` and allow any connections through your firewall. (It will only be you connnecting to your own PC.)
15. Open a browser and visit http://127.0.0.1:3001. Read the blurb if you like, click through, and you will be automatically redirected to [MobyGames](https://www.mobygames.com), [IGDB](https://www.igdb.com) or [RAWG.io](https://rawg.io) for the game that was selected!
16. Keep the "server" running and bookmark the blurb page to keep on pickin'!
    
Have Fun and Stay Gaming!!

### Future Potential Improvements

- Pick by categories.
- Sort by criteria.
- Search keywords.
- Related games.
- Access user's own game libraries.
- Development as a webapp.

### Licensing and Usage

Steal it, take credit for it, change it, improve it, sell it, it's yours. 

If you want to bullshit with me, visit https://discord.com/invite/gAugxKBHQY.

If you want to encourage other coding projects like this, donate to https://www.patreon.com/cacophony1979
