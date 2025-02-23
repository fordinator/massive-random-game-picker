process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, '\nReason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

import open from 'open'
import axios from 'axios'
import weightedRand from 'weighted-random'
import dotenv from 'dotenv'
import express from 'express'

// open = require('open');
// const axios = require('axios');
// const weightedRand = require('weighted-random');

dotenv.config();

const app=express();

app.use(express.urlencoded({ extended: true }));

const PORT = 3001;

const Moby = {
  id: 0,
  weight: 100
};
  
const IGDB = {
  id: 1,
  weight: 50,
};

const rawgIO = {
  id: 2,
  weight: 25,
};

const mobyApiKey = "";
const twitchClientID = "";
const twitchClientSecret = "";
const rawgApiKey =  "";
const weights = [0, 40, 60, 70, 80, 90];
    
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

async function getIGDBGame(offset, rating, token) {
  try {
    var query =
      rating === 0
        ? `fields *; where rating > ${rating} | rating = null; limit 1; offset ${offset};`
        : `fields *; where rating >= ${rating}; limit 1; offset ${offset};`;
    var response = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': twitchClientID,
        Authorization: `Bearer ${token}`,
      },
      data: query,
    });
    return response.data[0];
  } catch (err) {
    console.error(err);
	return '';
  }
}

async function authenticateTwitch() {
  try {
    const response = await axios({
      url: `https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchClientSecret}&grant_type=client_credentials`,
      method: 'POST',
    });

    return response.data.access_token;
  } catch (err) {
    console.error(err);
	return '';
  }
}

async function getCount(authToken, rating) {
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/games/count',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': twitchClientID,
        Authorization: `Bearer ${authToken}`,
      },
      data: `where rating > ${rating};`,
    });

    return response.data.count;
  }
    catch (err) {
      console.error(err);
	return '';
  }
}

async function getRawgCount() {
  try { 
    const response = await axios({
	    url: `https://api.rawg.io/api/games?key=${rawgApiKey}&ordering=name`,
		method: 'GET',
		headers: { 'User-Agent': 'Random Game Picker' },
    });

    return response.data.count;
  } catch (err) {
    console.error(err);
	return ''
  }
}

async function fetchRawgSlug(number) {
  try {
    const response = await axios({
	  url: `https://api.rawg.io/api/games?key=${rawgApiKey}&page_size=1&page=${number}`,
      method: 'GET',
      headers: { 'User-Agent': 'Random Game Picker' },
    });

    return response.data.results[0].slug;
  } catch (err) {
    console.error(err);
	return '';
  }
}

async function getMobyGame() {
  try {
	var response = await axios({
	  url: `https://api.mobygames.com/v1/games/random?api_key=${mobyApiKey}`,
	  method: 'GET',
	});

	var randomInRandom = getRandomInt(0,100);
	return response.data.games[randomInRandom];
  } catch (err) {
	console.error(err);
	return '';
  }
}
	  

async function pickGame() {
  var whichDB = weightedRand([Moby.weight, IGDB.weight, rawgIO.weight]);
    
  if (whichDB === Moby.id) {
	try {
	  var game = await getMobyGame();
	  
	  var url = `https://mobygames.com/game/${game}`
	  
	  return url;
	}
    catch (err) {
	console.error (err);
	res.status(500).send('An error occurred while picking a game.');
	return 'undefined';
    } 
  } else if (whichDB === IGDB.id) {
      try {
        var selectionIndex = weightedRand(weights);
        var rating = weights[selectionIndex];
        var twitchAuthToken = await authenticateTwitch();
        var count = await getCount(twitchAuthToken, rating);
        var offset = getRandomInt(1, count);
        var game = await getIGDBGame(offset, rating, twitchAuthToken);
	  
        while (isEmptyObject(game)) {
          offset = getRandomInt(1, count);
          game = await getIGDBGame(offset, rating, twitchAuthToken);
        } 
		
		 return game.url;
      }
	  catch (err) {
      console.error(err);
	  res.status(500).send('An error occurred while picking a game.');
	  return 'undefined';
    }
  } else if (whichDB === rawgIO.id) {

  try {
    var count = await getRawgCount();
    var randomNumber = getRandomInt(1, count);
    var slug = await fetchRawgSlug(randomNumber);
    return 'https://rawg.io/games/' + slug;
    }
    catch (err) {
	  console.error(err);
	  res.status(500).send('An error occurred while picking a game.');
	  return 'undefined';
    }
  }
}

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Massive Random Game Picker!</title>
		<style>
		  body {
			font-family: Arial, sans-serif;
			padding: 20px;
		  }
		h1 {
			color: #800080;
		}
		p {
			color #555;
		}
		a:link {
			color #800080;
			text-decoration: none;
		}
		a:visited {
			color: #2E0854;
			text-decoration: none;
		  }
		a:hover {
			text-decoration: underline;
		}
		.loading {
			font-size: 1.5em;
			color: #999;
		}
		game-result {
			margin-top: 20px;
		}
		#spinner {
			display: none;
		}
		#get-game-button {
			padding: 10px 20px;
			font-size: 1em;
			background-color: #800080;
			color: white;
			border: none;
			cursor: pointer;
		}
		#get-game-button:hover {
			background-color: #9932CC;
		}
	  </style>
      <meta name="description" content="Pick a completely random videogame from three MASSIVE databases! Over one MILLION games! No ads! No cookies! Secure connection!">
      </head>
      <body>
        <h1>Welcome to The Massive Random Game Picker!</h1>
        <p>This simple app picks a game (somewhat) at random from the million or so games in the MobyGames, IGDB, and RAWG databases.</p>
		<p>The goal is not so much to make decisions for you, but to give you inspiration what to play next, or inform you of cool games you never heard of.</p>
		<p>That said, it is not ENTIRELY random. MobyGames comes up about half the time. IGDB about 1/4th. RAWG about 1/8th.
		<p>The Picker prioritizes major releases with a decent rating, except for RAWG, where you are likely to receive some half-finished Game Jam project.</p>
		<p>These services all have rate limits and in the case of RAWG, a lot of unreliability, so if you can't get it to work, come back later.</p>
		<h3>Have Fun and Stay Gaming!</h3>
		<br>
		<a href="/pick-game" id="get-game-button">Get a Random Game</a>
      </body>
    </html>
  `);
});

app.get('/pick-game', async (req, res) => {
  const result = await pickGame();
  res.redirect(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
