const navigationLinks = Array.from(document.querySelectorAll('nav ul li a'))
const findOneLink = navigationLinks.find((link) => {
    return link.pathname === window.location.pathname
})

const addActiveClass = () => {
    findOneLink.classList.add('activeLink')
}

addActiveClass()
