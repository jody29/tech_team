let insertButton = document.querySelector('#genreInputButton')
let genreGenreInput = document.querySelector('#genreInput')
let insertSongButton = document.querySelector('#songInputButton')
let songSearchInput = document.querySelector('#songInput')

const insertGenre = () => {
    const searchInput = document.querySelector('#genreInput').value
    if (searchInput == '') {
        console.log('No search query')
    } else {
        //clearing input field
        document.querySelector('#genreInput').value = ''

        // Declaring the new element with its upcomming parent
        const queryList = document.querySelector('#genreContainer > #genreContainer')
        const newFormInput = document.createElement('input')

        // setting atributes
        newFormInput.setAttribute('value', searchInput)
        newFormInput.setAttribute('type', 'text')
        newFormInput.setAttribute('name', 'FavGenres')
        newFormInput.setAttribute('readonly', '')
        newFormInput.setAttribute('class', 'createdGenres')
        newFormInput.setAttribute('onclick', 'remove(this)')
        // pusing 
        queryList.appendChild(newFormInput)
    }
}
const insertSong = () => {
    const searchInput = document.querySelector('#songInput').value
    if (searchInput == '') {
        console.log('No search query')
    } else {
        document.querySelector('#songInput').value = ''

        const queryList = document.querySelector('#musicContainer')
        const newFormInput = document.createElement('input')

        newFormInput.setAttribute('value', searchInput)
        newFormInput.setAttribute('type', 'text')
        newFormInput.setAttribute('name', 'FavSongs')
        newFormInput.setAttribute('readonly', '')
        newFormInput.setAttribute('class', 'createdSongs')
        newFormInput.setAttribute('onclick', 'remove(this)')

        queryList.appendChild(newFormInput)
    }
}
// removes element when it gets clicked on
const remove = (el) => {
    var element = el
    element.remove()
}
// Functions deletes user account upon answering the question
const confirmDeletemessage = () => {
    const delBoolean = confirm(
        'Are you sure you want to delete your account? It will be gone forever and be unretrievable'
    )
    if (delBoolean == true) {
        console.log('account wordt verwijdert')
        window.location.href = '/deleteAccount'
    } else console.log('toch maar niet')
}

/* Eventlistners */

insertButton.addEventListener('click', insertGenre)
insertSongButton.addEventListener('click', insertSong)
genreGenreInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault()
        insertGenre()
    }
    
})
songSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        insertSong()
    }
})

