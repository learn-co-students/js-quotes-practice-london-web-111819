// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

//global variables
const quotesWithLikesUrl = "http://localhost:3000/quotes?_embed=likes"
const baseUrl = "http://localhost:3000/quotes"
const likesUrl = "http://localhost:3000/likes"
const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')
const quoteField = document.querySelector('#new-quote')
const authorField = document.querySelector('#author')

//request functions 

function get(url){
    return fetch(url)
    .then((response) => response.json())
}

function post(url, bodyObject){
    return fetch(url, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bodyObject)
    }).then((response) => response.json())
}

function destroy(url, id){
    return fetch(`${url}/${id}`,{
        method:"DELETE"
    })
}

function patch(url, id, bodyObject){
    return fetch(`${url}/${id}`,{
        method:"PATCH",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bodyObject)
    }).then((response) => response.json())
}

//functions

function renderQuote(quote){
    let li = document.createElement("li")
    li.className ="quote-card"
    let blockquote = document.createElement("blockquote")
    blockquote.className="blockquote"
    let p = document.createElement("p")
    p.className = "mb-0"
    p.innerText=quote.quote
    let footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author
    let br = document.createElement("br")

    let form = document.createElement("form")
    renderEditForm(form)
    form.addEventListener("submit", () => editQuote(quote.id))

    let likesButton = document.createElement("button")
    likesButton.className = "btn-success"
    likesButton.innerHTML=`Likes: <span>${quote.likes.length}<span>`
    likesButton.addEventListener('click', () => addLikeToQuote(quote.id, likesButton))
    let editButton = document.createElement("button")
    editButton.className ="btn-primary"
    editButton.innerText = "Edit"
    editButton.addEventListener('click', () => showOrHideEditForm(form))
    let deleteButton = document.createElement("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener('click', () => deleteQuote(quote.id,quote.likes))
    blockquote.append(p, footer, br, form, likesButton, editButton, deleteButton)
    li.appendChild(blockquote)
    quoteList.appendChild(li)
}

function renderEditForm(editForm){
    editForm.classList.add("edit-form", "hidden")
    let editQuoteField = document.createElement("input")
    editQuoteField.id = "edit-quote"
    editQuoteField.type = "text"
    editQuoteField.placeholder = "edit quote"
    let submitbutton = document.createElement("button")
    submitbutton.innerText= "Submit"
    submitbutton.type = "submit"
    submitbutton.className = "btn-primary"
    editForm.append(editQuoteField, submitbutton)
}
function getAllQuotes(){
    get(quotesWithLikesUrl)
    .then((quotes) => quotes.forEach(renderQuote))
}

function addNewQuote(){
    event.preventDefault()

    bodyObject = {
        quote: quoteField.value,
        author: authorField.value,
        likes:[]
    }
    post(likesUrl,bodyObject)
    .then((newQuote) => renderQuote(newQuote))
    debugger
}

function deleteQuote(id){
    let blockquote = event.target.parentNode
    let li = blockquote.parentNode
    destroy(baseUrl, id)
    .then(() => li.remove())
}

function addLikeToQuote(quoteId, button){
    event.preventDefault()
    
    bodyObject = {
        quoteId: quoteId,
        createdAt: Date.now()
    }

    post(likesUrl, bodyObject)
    .then(function(){
        button.innerText = `Likes: ${parseInt(button.innerText.split(" ")[1])+1}`
    })
}

function showOrHideEditForm(form){
    if(form.classList.contains("hidden")){
        form.classList.remove("hidden")
    } else {
        form.classList.add("hidden")
    }
}

function editQuote(quoteId){
    event.preventDefault()

    bodyObject = {
        quote: event.target.querySelector("#edit-quote").value
    }
    
    patch(baseUrl, quoteId, bodyObject)
    .then((quote) => )
}


document.addEventListener("DOMContentLoaded", function(){
    getAllQuotes()

    newQuoteForm.addEventListener('submit', addNewQuote)
})
