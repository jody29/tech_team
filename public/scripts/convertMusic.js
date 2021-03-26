const Spotify = require('node-spotify-api')
require('dotenv').config()
// Running this code localy requires the spotify secret to be put in as a sting and NOT as a refrence
const spotify = new Spotify({
    id: 'ae37c903c1ed41439ba773eb8670e39c',
    secret: process.env.APIKEY,
})

// Function takes input strings and converts them to objects
const convertMusic = (inputQuery) => {
	return new Promise((resolve, reject) => {
		spotify.search({ type: "track", query: inputQuery }, (err, data) => {
			if (err) {
				return err + console.log(err);
			}
			let songdata = data.tracks.items[0];
			let songartist = songdata.album.artists[0].name;
			let artistArray = songdata.artists;

			// Checking if there are mulitplile artist, if so, it pushses them into a separate array
			if (artistArray.length > 1) {
				const allArtists = [];
				for (let i = 0; i < artistArray.length; i++) {
					const artist = artistArray[i].name;
					allArtists.push(artist);
				}
				// Creating objects from the fetched data and returning this to the funciton.
				const trackobject = {
					title: songdata.name,
					artist: allArtists,
					coverURL: songdata.album.images[0].url,
					matchID: songdata.album.id,
					spotURL: songdata.external_urls.spotify,
				}
			
				resolve(trackobject)
			} else {
				// als er maar een artiest op een track zit
				const trackobject = {
					title: songdata.name,
					artist: songartist,
					coverURL: songdata.album.images[0].url,
					matchID: songdata.album.id,
					spotURL: songdata.external_urls.spotify,
				}
				resolve(trackobject);
			}
		})
	})
}
// This function takes the array of music and loops then one by one to create a unique object for each
const inputLoop = async(musicArray) => {
    if (Array.isArray(musicArray) == false) {
        let songObject = []
        songObject.push(await convertMusic(musicArray))
        return songObject
    } else {
        let songObject = []
        for (let i = 0; i < musicArray.length; i++) {
            songObject.push(await convertMusic(musicArray[i]))
        }
		
        console.log('Ready for export', songObject)
        return songObject
    }
}
module.exports.inputLoop = inputLoop
