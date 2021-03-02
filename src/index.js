const quotesUrl = 'http://localhost:3000/quotes?_embed=likes'
const likeUrl = 'http://localhost:3000/likes'

getQuotes()

//! Locating the form 
let form = document.getElementById('new-quote-form')
//! Creating a sumbit button function 
form.addEventListener('submit', handleSubmit)

//! Fetching data  
function getQuotes (){
    fetch(quotesUrl)
        .then(res => res.json())
        .then(quotes => quotes.forEach(quote => renderCards(quote)))
}

//! Adding to the data 
function postQuotes (quote){
    fetch(quotesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(quote)
    })
        .then(res => res.json())
        .then(quote => renderCards(quote))
}

//! Deleting from the data 
function deleteQuotes(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(() => {
            let oldQuote = document.getElementById(id)
            oldQuote.remove()
        })
}

//! Adding/Creating new likes in the likeUrl 
function likeQuotes(quote) {
    let like = {
        quoteId: quote.id 
    }
    fetch(likeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(like)
    })
        .then(res => res.json())
        .then((newLike) =>{
            let li = document.getElementById(quote.id)
            let span = li.querySelector('span')
            quote.likes.push(newLike)
            let likes = quote.likes.length
            span.textContent = likes
        })
}


//! Handles the submit button 
function handleSubmit (e){
    e.preventDefault()
    let quote = {
        quote: e.target.quote.value,
        author: e.target.author.value,
        likes: [] 
    }
    postQuotes(quote)
}


//! Building the quote card 
function renderCards(quote){
    // console.log(quote)

    //! need a parent id 
    let ul = document.getElementById('quote-list')

    //! build some elements 
    let li = document.createElement('li')
    let p = document.createElement('p')
    let footer = document.createElement('footer')
    let btn = document.createElement('button')
    let deletebtn = document.createElement('button')
    let span = document.createElement('span')
    let blockquote = document.createElement('blockquote')
    let br = document.createElement('br')

    //! assign class, id, and innerText to elements 
    li.className = 'quote-card'
    li.id = quote.id //! using this id to help delete the whole li
    blockquote.className = 'blockquote'
    p.className = 'mb-0'
    p.innerText = quote.quote 
    footer.className = 'blockquote-footer'
    footer.innerText = quote.author
    btn.className = 'btn-success'
    btn.innerText = 'Likes: '
    span.innerText = quote.likes.length
    deletebtn.className = 'btn-danger'
    deletebtn.innerText = 'Delete'


    //! event listener 
    deletebtn.addEventListener('click', () => deleteQuotes(quote.id))
    btn.addEventListener('click', () => likeQuotes(quote))

    //! append 
    btn.appendChild(span)
    blockquote.append(p,footer,br,btn,deletebtn)
    li.appendChild(blockquote)
    ul.appendChild(li)

}


