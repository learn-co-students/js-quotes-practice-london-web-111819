document.addEventListener("DOMContentLoaded", function() {

//HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

function destroy(URI,id){
    let configObj = {
        method: "DELETE"
    }
    return fetch(`${URI}/${id}`,configObj).then(response=>response.json())
}

function post(URI,newObj){
    let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newObj)
      };
    return fetch(URI, configObj).then(response=>response.json())
}

//CONSTANTS
const QUOTES_BASE_URL="http://localhost:3000/quotes"
const LIKES_BASE_URL="http://localhost:3000/likes"
const QUOTE_LIST = document.getElementById("quote-list")
const NEW_QUOTE_FORM = document.getElementById("new-quote-form")

//FUNCTIONS
function populatePageWithExistingQuotes(){
    get(`${QUOTES_BASE_URL}?_embed=likes`).then(quotes=>quotes.forEach(renderQuoteToPage))
}

function renderQuoteToPage(quote){
    let newLi = document.createElement('li')
    newLi.classList.add('quote-card')
    let newBlockQuote = document.createElement('blockquote')
    newBlockQuote.classList.add('blockquote')
    let newP = document.createElement('p')
    newP.innerText = quote.quote
    let newFooter = document.createElement('footer')
    newFooter.classList.add("blockquote-footer")
    newFooter.innerText = quote.author
    let newBreak = document.createElement("br")
    let newLikesButton = document.createElement('button')
    newLikesButton.innerText = `Likes: ${quote.likes.length}`
    newLikesButton.classList.add("btn-success")
    newLikesButton.addEventListener("click",function(event){
        addLikesAndUpdatePage(quote.id,newLikesButton)
    })
    let newDeleteButton = document.createElement('button')
    newDeleteButton.innerText = "Delete"
    newDeleteButton.classList.add("btn-danger")
    newDeleteButton.addEventListener("click",function(event){
        deleteQuoteAndRemoveFromPage(quote.id,newLi)
    })
    newBlockQuote.append(newP,newFooter,newBreak,newLikesButton,newDeleteButton)
    newLi.appendChild(newBlockQuote)
    QUOTE_LIST.appendChild(newLi)
}

function deleteQuoteAndRemoveFromPage(id,elementToRemove){
    destroy(QUOTES_BASE_URL,id).then(()=>elementToRemove.remove())
}

function addLikesAndUpdatePage(id,elementToWorkWith){
    let newQuoteId = id
    let newObj = {
        quoteId: newQuoteId
    }
    post(LIKES_BASE_URL,newObj).then(newLike=>processNewLike(newLike,elementToWorkWith))
}

function processNewLike(newLike,elementToWorkWith){
    currentCountOfLikes = parseInt(elementToWorkWith.innerText.slice(6))
    elementToWorkWith.innerText = `Likes: ${currentCountOfLikes+1}`
}

// function provideNumberOfLikes(quoteId){
//     // return get(LIKES_BASE_URL).then(likesArray=>countForThisId(likesArray,quoteId))
//     return get(LIKES_BASE_URL).then(likesArray=>function(likesArray){
//         console.log(likesArray)
//         debugger
//     })
// }



//LOADERS
populatePageWithExistingQuotes()


NEW_QUOTE_FORM.addEventListener("submit",function(event){
    let newQuoteText = document.getElementById("new-quote").value
    let newAuthor = document.getElementById("author").value
    let newObj = {
        quote: newQuoteText,
        author: newAuthor 
    }
    post(QUOTES_BASE_URL,newObj).then(quote=>renderQuoteToPage(quote))
})



})