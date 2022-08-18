/*
* TASK 2
* */

let formElement = document.forms["formElement"];

formElement.addEventListener("focusin", event => {
    let activeElement = formElement.querySelector(".focused");
    if(activeElement) {
        activeElement.classList.remove("focused");
    }
    event.target.classList.add("focused");
})

formElement.addEventListener("focusout", event => {
    let activeElement = formElement.querySelector(".focused");
    if(activeElement) {
        activeElement.classList.remove("focused");
    }
})
