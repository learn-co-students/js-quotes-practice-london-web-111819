// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded', () =>{


// api functions

function get(url){
    return fetch(url).then(resp => resp.json())
}

function post(url, bodyObject){
    return fetch(url, {
      method: 'POST',
      headers:
  {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
    body: JSON.stringify(bodyObject)
    }).then(resp => resp.json())
  }

  function destroy(url, id){
    return fetch(url + id, {
        method: 'DELETE'
    })
  }

//consts

const baseUrl = 'http://localhost:3000/quotes?_embed=likes'
const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')
const newQuoteInput = document.querySelector('#new-quote')
const newAuthorInput = document.querySelector('#author')
const likesUrl = 'http://localhost:3000/likes'




// functions

function createQuote(quote){
    let li = document.createElement('li')
    li.classList.add('quote-card')

    let blockQuote = document.createElement('blockquote')
    blockQuote.classList.add('blockquote')

    let p = document.createElement('p')
    p.classList.add('mb-0')
    p.innerText = quote.quote

    let footer = document.createElement('footer')
    footer.classList.add('blockquote-footer')
    footer.innerText = quote.author

    let br = document.createElement('br')

    let span = document.createElement('span')
    span.innerText = quote.likes.length

    let likeBtn = document.createElement('button')
    likeBtn.classList.add('btn-success')
    likeBtn.innerText = 'Likes: '
    likeBtn.addEventListener('click', () => renderLikes(span, quote.id))

    let deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn-danger')
    deleteBtn.innerText = 'Delete'
    deleteBtn.addEventListener('click', () => deleteQuote(quote.id, li))


    likeBtn.append(span)
    li.append(blockQuote, p, footer, br, likeBtn, deleteBtn)
    quoteList.append(li)
    
}

function getAndRenderQuotes() {
    get(baseUrl).then(quotes => quotes.forEach(createQuote))
}

function postNewQuote(e){
    e.preventDefault()
    let bodyObject = {
        quote: newQuoteInput.value,
        author: newAuthorInput.value,
        likes: []
    }
    post(baseUrl, bodyObject).then(createQuote)
}

function renderLikes(spanElement, id){
    let likes = parseInt(spanElement.innerText)+1
    spanElement.innerText = likes
    postLikes(id)
}

function postLikes(id){
    let bodyObject = {
        quoteId: id
    }
    post(likesUrl,bodyObject)   
}


function deleteQuote(id, li){
    destroy(baseUrl, id).then(li.remove())
}



getAndRenderQuotes()
quoteForm.addEventListener('submit', postNewQuote)
})