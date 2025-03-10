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
    res.render('index');
});
app.get('/artist-search', (req, res, next) => {
console.log(req.query.artist);
spotifyApi
    .searchArtists(req.query.artist)
    .then(function(artist) {
    let artistsArray = artist.body.artists.items
    res.render('artist-search-results', {artistsArray})
    })
    .catch(err => console.log('The error while searching artists: ', err));
});
app.get('/albums/:artistId', (req, res, next) => {
    let artistId = req.params.artistId
    console.log(artistId);
    spotifyApi
    .getArtistAlbums(`${artistId}`)
    .then(function(album) {
        let albumsArray = album.body.items
        res.render('albums', {albumsArray})
    })
    .catch(err => console.log('The error while searching albums: ', err));
});

app.get('/tracks/:tracksId', (req, res, next) => {
    let tracksId = req.params.tracksId
    console.log(tracksId);
    spotifyApi
.getAlbumTracks(`${tracksId}`)
    .then(function(track) {
        let tracksArray= track.body.items
        res.render('tracks', {tracksArray})
    })
    .catch(err => console.log('The error while searching tracks: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));