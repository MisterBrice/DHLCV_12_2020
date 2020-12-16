window.addEventListener('load', function (evt) {
    initialisationJS();
    document.querySelector('form').addEventListener('submit', formSubmited);    
});

function initialisationJS() {
    var balise = document.querySelector('#jsload');
    balise.style.backgroundColor = "green";
    balise.innerHTML = "JS CHARGE";
}

initialisationJS();

function formSubmited(event) {
    event.preventDefault();
    
    createPostit(event.target[0].value, event.target[1].value, event.target[2].value, event.target[3].value);
}
/**
 * Création d'un post-it
 * @param {*} titre 
 * @param {*} date 
 * @param {*} heure 
 * @param {*} description 
 */
function createPostit (titre, date, heure, description) {
    var postitTmp = document.createElement('div');
    postitTmp.classList.add('postit');
    postitTmp.innerHTML='<div class="postit-titre">' + titre + '</div> \
    date : <span class="datetime">' + date + '</span> heure : <span class="datetime">' + heure + '</span> \
    <h2>Description :</h2>' + description;

    var listPostit = document.querySelector('#list');
    listPostit.append(postitTmp);
}

