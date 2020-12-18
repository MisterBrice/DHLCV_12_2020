var lastID=0;
var descripteurInterval;
//chargement du DOM est bien achevé
addEventListener('load', function (evt) {
    // console.log(evt)
    //usage d'une fonction
    initialisationJS('Alexandre');
    //accrochage d'un ecouteur d'event sur une balise 
    //event : submit
    //fonction à declencher pour l'event -> formSubmited
    document.querySelector('form').addEventListener('submit', formSubmited);
    document.querySelector('form').addEventListener('reset', formReset);
    //chargement initial des postit
    descripteurInterval = setInterval(pullingFunction, 1000);
});


const formReset = (event) => {
    const form = document.forms["editor-form"];
    for (let i = 0; i< form.length; i++) {
        if (form[i].type !== 'reset' && form[i].type !== 'submit') {
            form[i].value = "";
        }
    }
}

//declaration d'une fonction
function initialisationJS(prenom) {
    //deffinition d'une variable et affectation d'un contenu
    var jsload = document.querySelector('#jsload');
    //moddif. du contenu html de la balise dans la var
    jsload.innerHTML = 'mon <span style="font-weight:900">JS</span> est chargé pour ' + prenom;
    //moddif. du style de la balise dans la var
    jsload.style.backgroundColor = 'LIME';
}


function formSubmited(evt) {
    evt.preventDefault();
    console.log('Mon formulaire est "submit" ');
    // console.log(evt);
    console.log(evt.target[0].value);
    console.log(evt.target['date'].value);
    console.log(evt.target[2].value);
    console.log(evt.target[3].value);
    //autre method
    //console.log(document.querySelector('form'));
    var monFormulaire = document.forms['editor-form'];
    //usage de moment js 
    //var dateFormated=moment(monFormulaire['date'].value,'DD MM YYYY')
    var postit = {
        titre: monFormulaire["title"].value,
        datetime: monFormulaire["date"].value + "T" + monFormulaire["time"].value,
        description: monFormulaire["description"].value
    };

    if ('' !== monFormulaire['id'].value) {
        postit.id = monFormulaire['id'].value;
    }

    (new Crud(BASE_URL)).envoiRessource('/postit', postit, function (monPostit) {

        //ajout dans la liste de l'element
        if (undefined !== postit.id) {
            document.querySelector('#postit-' + postit.id).remove();
        }

        createPostitByObject(monPostit);

        monFormulaire.reset();
    });
}
/**
 * Fonction de création d'un postit avec ajout dans la balise div#list
 * @param {String} titre titre de la note
 * @param {String} date date ISO AAAA-MM-JJ pour la note
 * @param {String} heure heure ISO HH:MM:SS pour la note
 * @param {String} description description de la note
 */
function createPostit(titre, date, heure, description) {
    var postit = document.createElement('div');
    // postit.setAttribute('class','postit');
    //postit.className='postit';
    //ajout d'une class dans la liste de class d'un element
    postit.classList.add('postit');
    //possibilité de suppression d'une class d'une balise
    //postit.classList.remove('postit');
    //-----------------------------------
    //creation du contenu par interpretation de la chaine et constitution d'un DOM pour cette balise
    postit.innerHTML = '<div class="close"><img src="img/close.png"/></div><div class="postit-titre">' + titre + '</div>\
    date : <span class="datetime">'+ date + '</span> heure : <span class="datetime">' + heure + '</span>\
    <h2>Description :</h2>'+ description;

    //selection a partir de postit de ".close img" , puis addEventListener('click',deletePostit)
    postit.querySelector('.close img').addEventListener('click', deletePostit);

    //selection de la liste de postit
    var liste = document.querySelector('#list');
    //ajout dans la liste de l'element
    liste.append(postit);
}
/**
 * Fonction de création d'un postit avec ajout dans la balise div#list par le biais d'un objet postit complet
 * @param {Object} postitInput object postit instancié
 */
function createPostitByObject(postitInput) {
    var postit = document.createElement('div');
    //creation de l'id de balise en liens avec l'id du postit dans le rest
    //pour faciliter la suppression
    postit.id = 'postit-' + postitInput.id;
    // postit.setAttribute('class','postit');
    //postit.className='postit';
    //ajout d'une class dans la liste de class d'un element
    postit.classList.add('postit');
    postit.addEventListener('dblclick', putinformclickedpostit);
    //possibilité de suppression d'une class d'une balise
    //postit.classList.remove('postit');
    //-----------------------------------
    //creation du contenu par interpretation de la chaine et constitution d'un DOM pour cette balise
    postit.innerHTML = '<div class="close"><img src="img/close.png"/></div><div class="postit-titre">' + postitInput.titre + '</div>\
    date : <span class="datetime postit-date">'+ postitInput.datetime.substring(0, 10) + '</span> heure : <span class="datetime postit-heure">' + postitInput.datetime.substring(11) + '</span>\
    <h2>Description :</h2><div class="postit-description">'+ postitInput.description + '</div>';

    //selection a partir de postit de ".close img" , puis addEventListener('click',deletePostit)
    postit.querySelector('.close img').addEventListener('click', deletePostit);

    //selection de la liste de postit
    var liste = document.querySelector('#list');
    //ajout dans la liste de l'element
    liste.append(postit);
}
function deletePostit(evt) {
    evt.stopPropagation();
    console.log('evenement lié à la suppression d\'une note', evt);
    var domPostitId = evt.path[2].id.substring(7);
    (new Crud(BASE_URL)).supprimer('/postit/' + domPostitId, function () {
        evt.path[2].remove();
    });

}

function putinformclickedpostit(event) {
    var target = event.currentTarget;

    document.forms['editor-form']['id'].value = target.id.substring(7);
    document.forms['editor-form']['title'].value = target.querySelector('.postit-titre').innerText;
    document.forms['editor-form']['date'].value = target.querySelector('.postit-date').innerText;
    document.forms['editor-form']['time'].value = target.querySelector('.postit-heure').innerText;
    document.forms['editor-form']['description'].value = target.querySelector('.postit-description').innerText;
}

const pullingFunction=()=>{
   (new Crud (BASE_URL)).recuperer('/postit?id_gte='+(lastID+1), (listeDesPostit)=>{
        listeDesPostit.map((element, index, listeOriginel)=>{
            lastID= (lastID<element.id?element.id:lastID);
            createPostitByObject(element);
        });
   });
}