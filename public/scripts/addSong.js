let insertSongButton = document.querySelector('#songInputButton')
let songSearchInput = document.querySelector('#songInput')

const insertSong = () => {
    const searchInput = document.querySelector('#songInput').value
    console.log(`er is gezocht op: ${searchInput}`)
    if (searchInput == '') {
        //   checkt of het input veld niet leeg is
        console.log('No search query')
    } else {
        // start zodra de waarde in het invoer veld niet "" is
        // Input veld word leeg gehaald
        document.querySelector('#songInput').value = ''

        // declareren nieuwe variable voor nieuw element
        const queryList = document.querySelector('#musicContainer')
        const newFormInput = document.createElement('input')

        // nieuw element krijgt atriubuten mee
        newFormInput.setAttribute('value', searchInput)
        newFormInput.setAttribute('type', 'text')
        newFormInput.setAttribute('name', 'FavSongs')
        newFormInput.setAttribute('readonly', '')
        newFormInput.setAttribute('class', 'createdSongs')
        newFormInput.setAttribute('onclick', 'remove(this)')
        // Het nieuwe element wordt op de juiste plek in de DOM toegevoegd
        queryList.appendChild(newFormInput)
    }
}

insertSongButton.addEventListener('click', insertSong)
songSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        insertSong()
    }
})
const remove = (el) => {
    var element = el
    element.remove()
}
