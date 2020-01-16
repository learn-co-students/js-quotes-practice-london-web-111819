document.addEventListener("DOMContentLoaded", function() {

    //constants
    const quotesUl = document.querySelector("#quote-list")
    const quotesForm = document.querySelector("#new-quote-form")
    //const submitBtn = document.querySelector("submit") - dont need click event, need submit event on form
    const getUrl = "http://localhost:3000/quotes?_embed=likes"
    const postQuoteUrl = "http://localhost:3000/quotes/"
    const postLikeUrl = "http://localhost:3000/likes/"


    function get(url) {
        return fetch(url)
        .then(resp => resp.json())
    }

    function post(url, obj) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"},
            body: JSON.stringify(obj)
        })
            .then(resp => resp.json())
        
    }

    function destroy(url, id) {
       return fetch(`${url}${id}`, {
           method: "DELETE"
       })
    }

    function getQuotes() {
       get(getUrl)
       .then(quotes => quotes.forEach(renderQuotes))
    }

    function renderQuotes(quote){
        

       let li = document.createElement("li")
       li.className = "quote-card"

       let blockquote = document.createElement("blockquote")
       blockquote.className = "blockquote"

       let p = document.createElement("p")
       p.className = "mb-0"
       p.innerText = quote.quote

       let footer = document.createElement("footer")
       footer.className = "blockquote-footer"
       footer.innerText = quote.author

       let br = document.createElement("br")

       let span = document.createElement("span")
       if (quote.likes){
       span.innerText = `${quote.likes.length}`
       }
       else
       { span.innerText = "0"}
       //this didnt work without if statement-
       //if there were no likes it was not coming back as 0, so we must set

       let likeBtn = document.createElement("button")
       likeBtn.className = "btn-success"
       likeBtn.innerText = `Likes: ${span.innerText}`

       let deleteBtn = document.createElement("button")
       deleteBtn.className = "btn-danger"
       deleteBtn.innerText = "Delete"

       blockquote.append(p, footer, br, likeBtn, deleteBtn)
       li.appendChild(blockquote)
       quotesUl.appendChild(li)

       likeBtn.addEventListener("click", () => postLike(quote, likeBtn))
       deleteBtn.addEventListener("click", () => deleteQuoteFromServerThenClient(quote, li))
    }

    function deleteQuoteFromServerThenClient(quote, li) {
        destroy(postQuoteUrl, quote.id).then(() => li.remove())
    }



    function postLike(quote, likeBtn) {
        
        event.preventDefault()
        let bodyObject = {
            // we dont need to add like id as it will get assigned on creation.
          quoteId: quote.id,
          createdAt: `${Date.now()}`
        }
        post(postLikeUrl, bodyObject).then( () => {
            // update whats already on the DOM, rather than trying to call:
        //   likeBtn.innerText = `Likes: ${quote.likes.length + 1}`
        let likeArray = likeBtn.innerText.split(": ")
        let newCount = Number(likeArray[1])+1
        likeBtn.innerText = `Likes: ${newCount}`
    }
        )
      }

      function postQuoteThenRenderQuote(event) {
        event.preventDefault()
        
        //if a name field in form, wouldve done:
        //    name: event.target.quote.value,
        //    image: event.target.author.value

          let newQuoteField = document.querySelector("#new-quote")
          let authorField = document.querySelector("#author")
          
          let bodyObject = {
              quote: newQuoteField.value,
              author: authorField.value
          }
          post(postQuoteUrl, bodyObject)
          .then(bodyObject => {
              renderQuotes(bodyObject)
              quotesForm.reset()
          })
      }

  getQuotes();

  quotesForm.addEventListener("submit", postQuoteThenRenderQuote)
})

