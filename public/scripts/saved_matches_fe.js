// Frontend JavaScript for saved_matches.ejs
"use strict"

var form = document.querySelectorAll("main ul li form, main article section form")

for (var i=0; i < form.length; i++){
  form[i].addEventListener('submit', function(e) {
    if (!window.confirm("Are you sure you want to delete this person?")) {
      e.preventDefault()
    }
  })
}