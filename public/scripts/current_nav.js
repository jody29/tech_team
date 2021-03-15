const navigationLinks = Array.from(document.querySelectorAll('nav ul li a'))
const findOneLink = navigationLinks.find(function (link) {
    return link.pathname === window.location.pathname
})

function addActiveClass() {
    findOneLink.classList.add('activeLink')
}
addActiveClass()
