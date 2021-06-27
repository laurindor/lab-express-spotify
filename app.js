require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
	res.render('home');
})


app.get('/artist-search', (req, res) => {


    spotifyApi
        .searchArtists(req.query.searchArtist)
        .then(data => {

            const foundArtists = data.body.artists.items
            console.log('The received data from the API: ', foundArtists);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', {foundArtists})

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.artistId)
      .then(data=> {
        const foundAlbums = data.body.items
        res.render('albums', { foundAlbums});
      })
      
      .catch(err=> console.log('The error while searching albums occurred: ', err));
 })


 app.get('/tracks/:id', (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then((data) => {
    const albumsTracks = data.body.items
      console.log('tracks', data.body);
      res.render('tracks', {albumsTracks})
  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
})

/*app.all('/beers', (req, res) => {
	punkAPI
		.getBeers()
		.then((responseFromDB) => {
			console.log('Response is:', responseFromDB);

			res.render('allBeers', { beers: responseFromDB });
		})
		.catch((error) => console.log(error));
});*/

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
