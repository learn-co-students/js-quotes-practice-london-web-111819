// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 


// constants

const quotesURI = 'http://localhost:3000/quotes?_embed=likes'
const baseURI = 'http://localhost:3000/quotes/'
const likesURI = 'http://localhost:3000/likes/'
const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')
const newQuoteInput = newQuoteForm.querySelector('#new-quote')
const newQuoteAuthorInput = newQuoteForm.querySelector('#author')

// api

function get(url) {
    return fetch(url).then(resp => resp.json())
}

function post(url, bodyObject) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify(bodyObject)
    }).then(resp => resp.json())
}

function destroy(url, id) {
    return fetch(url + id, {
        method: "DELETE"
    })
}

// functions

function createQuote(quote) {
    const li = document.createElement('li')
    li.classList.add('quote-card')

    const blockquote = document.createElement('blockquote')
    blockquote.classList.add('blockquote')

    const p = document.createElement('p')
    p.textContent = quote.quote
    p.classList.add('mb-0')

    const footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.textContent = quote.author

    const br = document.createElement('br')

    const likeBtn = document.createElement('button')
    likeBtn.textContent = 'Likes: '
    likeBtn.classList.add('btn-success')
    likeBtn.addEventListener('click', () => {
        postToLikes(quote.id, span)
    })

    const span = document.createElement('span')
    span.textContent = quote.likes.length

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'Delete'
    deleteBtn.classList.add('btn-danger')
    deleteBtn.addEventListener('click', () => {
        deleteQuote(quote.id, li)
    })

    likeBtn.append(span)
    blockquote.append(p, footer, br, likeBtn, deleteBtn)
    li.append(blockquote)
    quoteList.append(li)
}

function renderQuotes() {
    get(quotesURI).then(quotes => quotes.forEach(createQuote))
}

function postToQuotes(e) {
    e.preventDefault()
    let bodyObject = {
        quote: newQuoteInput.value,
        author: newQuoteAuthorInput.value,
        likes: []
    }
    post(quotesURI, bodyObject).then(createQuote)
}

function deleteQuote(id, li) {
    destroy(baseURI, id).then(li.remove())
}

function postToLikes(id, span) {
    let bodyObject = {
        quoteId: id
    }
    post(likesURI, bodyObject).then(function() {
        let likesNumber = span.textContent
        span.textContent = parseInt(likesNumber) + 1
    })
}

// event listeners

document.body.onload = renderQuotes
newQuoteForm.addEventListener('submit', postToQuotes)
