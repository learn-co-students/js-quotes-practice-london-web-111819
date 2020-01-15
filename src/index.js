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

function patch(URI,id,patchObj){
    let patchData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(patchObj)
        };
        return fetch(`${URI}${id}`,patchData).then(response=>response.json())
}
    // CONSTANTS
    const QUOTE_LIST = document.getElementById("quote-list")
    const QUOTES_BASE_URI = "http://localhost:3000/quotes"
    const NEW_QUOTE_FORM = document.getElementById("new-quote-form")
    const LIKES_BASE_URI = "http://localhost:3000/likes"

    // FUNCTIONS
    function bringALLTheQuotesToPage(){
        let uriToSend
        uriToSend = `${QUOTES_BASE_URI}?_embed=likes`
        get(uriToSend).then(processReceivedQuotes)
    }

    function processReceivedQuotes(allQuotes){
        allQuotes.forEach(putQuoteOnPage)
    }

    function putQuoteOnPage(quote){
        let newLi = document.createElement('li')
        newLi.classList.add("quote-card")
        let newBlockquote = document.createElement('newBlockquote')
        let newP = document.createElement('p')
        newP.classList.add("mb-0")
        newP.innerText = quote.quote
        let newFooter = document.createElement('footer')
        newFooter.classList.add("blockquote-footer")
        newFooter.innerText = quote.author
        let newBreak = document.createElement('break')
        let newLikesButton = document.createElement('button')
        newLikesButton.classList.add("btn-success")
        newLikesButton.innerText = "Likes: "
        newLikesButton.addEventListener("click",()=>addLikeAndShowInTheButton(quote,newSpan))
        let newSpan = document.createElement('span')
        if (quote.likes != null){
            newSpan.innerText = quote.likes.length
        } else {
            newSpan.innerText = 0
        }
        let newDeleteButton = document.createElement('button')
        newDeleteButton.classList.add("btn-danger")
        newDeleteButton.innerText = "Delete"
        newDeleteButton.addEventListener("click",()=>deleteQuoteAndRemoveFromPage(quote,newLi))
        //Appends right? yes
        newLikesButton.appendChild(newSpan)
        newBlockquote.append(newP,newFooter,newBreak,newLikesButton,newDeleteButton)
        newLi.appendChild(newBlockquote)
        QUOTE_LIST.appendChild(newLi)
    }

    function addLikeAndShowInTheButton(quote,spanElementToUpdate){
        event.preventDefault()
        let urlTOSend = LIKES_BASE_URI
        let configObj = {
            quoteId: quote.id
        }
        post(urlTOSend,configObj).then(()=>updateShowButton(spanElementToUpdate))
    }

    function updateShowButton(spanElementToUpdate){
        spanElementToUpdate.innerText = parseInt(spanElementToUpdate.innerText) + 1 
    }

    function deleteQuoteAndRemoveFromPage(quote,elementToRemove){
        destroy(QUOTES_BASE_URI,quote.id).then(elementToRemove.remove())
    }

    function addANewQuoteAndAddToTheQuotesOnPage(event){
        event.preventDefault();
        let newQuoteText = document.getElementById("new-quote").value
        let newQuoteAuthor = document.getElementById("author").value
        let newObjectToSend = {
            quote: newQuoteText,
            author: newQuoteAuthor
        }
        post(QUOTES_BASE_URI,newObjectToSend).then(newQuote=>putQuoteOnPage(newQuote))
    }

    //EVENTLISTENERS, INITIAL LOADERS
    bringALLTheQuotesToPage()
    NEW_QUOTE_FORM.addEventListener("submit",addANewQuoteAndAddToTheQuotesOnPage)

})