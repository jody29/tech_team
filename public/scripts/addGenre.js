let insertButton = document.querySelector('#genreInputButton')
let genreSearchInput = document.querySelector('#genreInput')

const insertGenre = () => {
    const searchInput = document.querySelector('#genreInput').value
    console.log(`er is gezocht op: ${searchInput}`)
    if (searchInput == '') {
        //   checkt of het input veld niet leeg is
        console.log('No search query')
    } else {
        // start zodra de waarde in het invoer veld niet "" is
        // Input veld word leeg gehaald
        document.querySelector('#genreInput').value = ''

        // declareren nieuwe variable voor nieuw element
        const queryList = document.querySelector(
            '#genreContainer > #genreContainer'
        )
        const newFormInput = document.createElement('input')

        // nieuw element krijgt atriubuten mee
        newFormInput.setAttribute('value', searchInput)
        newFormInput.setAttribute('type', 'text')
        newFormInput.setAttribute('name', 'FavGenres')
        newFormInput.setAttribute('readonly', '')
        newFormInput.setAttribute('class', 'createdGenres')
        newFormInput.setAttribute('onclick', 'remove(this)')
        // Het nieuwe element wordt op de juiste plek in de DOM toegevoegd
        queryList.appendChild(newFormInput)
    }
}

insertButton.addEventListener('click', insertGenre)
genreSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        insertGenre()
    }
})
