const socket = io.connect('/')

const typing = document.querySelector('#typing')
const message = document.querySelector('#message')
const chatId = document.querySelector('#chat').value
const messages = document.querySelector('.messageField')
const sendMessage = document.querySelector('#submit')
const username = user.firstName

messages.scrollTop = messages.scrollHeight

sendMessage.addEventListener('click', (e) => {
    e.preventDefault()
    // Prevent users from sending empty messages
    if (message.value == '') return
    socket.emit('new_message', {
        message: message.value,
        username,
        date: new Date(),
        userId: user._id,
        chatId,
    })
})

socket.on('new_message', (data) => {
    message.value = ''
    const messageSend = document.createElement('div')
    if (data.username == username) {
        messageSend.classList.add('outgoing')
    } else {
        messageSend.classList.add('incoming')
    }
    messageSend.innerHTML = `
    <div class="metadata">
        <span class="author">${
            data.username == username ? 'You' : data.username
        } at</span>
        <span class="date">${data.date}</span>
    </div>
    <p>${data.message}</p>
    `
    messages.appendChild(messageSend)
    messages.scrollTop = messages.scrollHeight
})

message.addEventListener('keypress', () => {
    socket.emit('typing', { username })
})

socket.on('typing', (data) => {
    setTimeout(() => {
        typing.textContent = ''
    }, 3000)
    typing.textContent = data.username + ' is typing...'
})
