// const { precompile } = require("handlebars");
const Spotify = require('node-spotify-api')
require('dotenv').config()

const spotify = new Spotify({
    id: 'ae37c903c1ed41439ba773eb8670e39c',
    secret: process.env.APIKEY,
})

/**
 * Deze functie is async omdat er een promise wordt gereturned. De promise
 * wordt geresolved met een trackObject.
 */

const convertMusic = (inputQuery) => {
    return new Promise((resolve, reject) => {
        spotify.search(
            { type: 'track', query: inputQuery },
            function (err, data) {
                if (err) {
                    return console.log(`Error occurred: ${err}`)
                }
                let songdata = data.tracks.items[0]
                console.log('here is all the song data')
                console.log(songdata)
                let songartist = songdata.album.artists[0].name
                console.log(songartist)
                let artistArray = songdata.artists
                // console.log(artistArray);

                if (artistArray.length > 1) {
                    // als er meerde artiesten op een track zitten
                    console.log('meer dan 1 artietst')
                    const allArtists = []
                    // loopt door alle arteist objecten om hun naam op te halen
                    for (let i = 0; i < artistArray.length; i++) {
                        const artist = artistArray[i].name
                        console.log(artist)
                        allArtists.push(artist)
                    }
                    console.log('artiesten', allArtists)
                    // object obouwen
                    const trackobject = {
                        title: songdata.name,
                        artist: allArtists,
                        coverURL: songdata.album.images[0].url,
                        matchID: songdata.album.id,
                        spotURL: songdata.external_urls.spotify,
                    }
                    console.log(trackobject)
                    resolve(trackobject)
                } else {
                    // als er maar een artiest op een track zit
                    console.log(`Artiest ${songartist}`)
                    const trackobject = {
                        title: songdata.name,
                        artist: songartist,
                        coverURL: songdata.album.images[0].url,
                        matchID: songdata.album.id,
                        spotURL: songdata.external_urls.spotify,
                    }
                    console.log('trackopject:', trackobject)
                    resolve(trackobject)
                }
            }
        )
    })
}

/**
 * Deze functie loopt door de verschillende input strings
 * en verzameld vervolgens trackObjects in een array
 */
const inputLoop = async (inputString) => {
    console.log(inputString.length)
    console.log(Array.isArray(inputString))
    if (Array.isArray(inputString) == false) {
        let songObject = []
        songObject.push(await convertMusic(inputString))
        return songObject
    } else {
        let songObject = []
        for (let i = 0; i < inputString.length; i++) {
            console.log(i)
            songObject.push(await convertMusic(inputString[i]))
        }
        console.log('Ready for export', songObject)
        return songObject
    }
    // zodra de functie klaar is geberut het volgende
}
// input

module.exports.inputLoop = inputLoop
