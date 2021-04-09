document.getElementById("imageFrigo").addEventListener("click", ouvreFrigo);

//Fonction de changement d'image au clic
//Permet de passer d'un frigo fermé à un frigo ouvert
function ouvreFrigo() {
    let imageActuelle = document.getElementById("imageFrigo");
    let elementsGestionFrigo = document.getElementsByClassName("contenuFrigo");
    if(imageActuelle.src.match("Images/FrigoFerme.png")){
        imageActuelle.src = "Images/FrigoOuvert.png";
        listeMesArticles();
        for(i=0; i<elementsGestionFrigo.length; i++){
            elementsGestionFrigo[i].style.display = "block";
            //elementsGestionFrigo[i].style.backgroundColor = "white";
            //elementsGestionFrigo[i].style.Opacity = "0.5";
        }
    }
    else {
        imageActuelle.src = "Images/FrigoFerme.png";
        for(i=0; i<elementsGestionFrigo.length; i++){
            elementsGestionFrigo[i].style.display = "none";
        }
    }
}

document.getElementById("ajouterArticle").addEventListener("click", nouveauProduit);

function nouveauProduit(){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let nomProduit = document.getElementById("newArticle").value;
    nomProduit = capitalize(nomProduit);
    let qteProduit = document.getElementById("quantite").value;
    if(qteProduit == 0 || qteProduit == "") qteProduit = 1;
    try{
        if (qteProduit < 0) throw Error("La quantité entrée doit être supérieure à 0");
        else {
            let produit = {"nom":nomProduit,"qte":qteProduit};
            const fetchOptions = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(produit)
            }
            fetch(url, fetchOptions)
                .then( (response) => {
                    if (produit.qte <= 0) throw "La quantité entrée doit être supérieure à 0";
                    if (isNaN(qteProduit)) throw "La quantité entrée doit être un entier";
                    else return response.json()
                })
                .then( (dataJSON) => {
                        viderLabel("newArticle");
                        viderLabel("quantite");
                        listeMesArticles();
                        document.getElementById("noteAjoutArticle").innerHTML =
                            "Le produit \"" + produit.nom + "\" a bien été ajouté en " + produit.qte + " exemplaire(s)";
                    
                })
                .catch( (error) => {
                    document.getElementById("noteAjoutArticle").innerHTML = "Attention : " + error;
                    console.log(error);
                });
        }
    }
    catch (error){
        document.getElementById("noteAjoutArticle").innerHTML = "Attention : " + error;
    }
}

document.getElementById("quantite").addEventListener("keydown", nouveauEnter);
document.getElementById("newArticle").addEventListener("keydown", nouveauEnter);

function nouveauEnter(event){
    let nomProduit = document.getElementById("newArticle").value;
    if (nomProduit !== "" && event.key === "Enter") { 
        event.preventDefault();
        document.getElementById("ajouterArticle").click();
    }
}

//Fonction permettant d'afficher la liste des articles enregistrés dans l'API
function listeMesArticles(){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const fetchOptions = {
        method: "GET"
    }
    fetch(url, fetchOptions)
        .then((response) => {
            return response.json();
        })
        .then((dataJSON) => {
            let articles = dataJSON;
            let resHTML = "";
            for (let a of articles) {
                resHTML = 
                    resHTML + "<li class=\"listeElement\" id=\"listeElement_" + a.id + "\">" + a.nom
                    + "<img src=\"Images/moins.png\" alt=\"-1\" class=\"imageMoins\" id=\"moinsUn_" + a.id + "\" HSPACE=\"5\">"
                    + a.qte
                    + "<img src=\"Images/plus.png\" alt=\"+1\" class=\"imagePlus\" id=\"plusUn_" + a.id + "\" HSPACE=\"5\">"
                    + "<img src=\"Images/supprimer.png\" alt=\"suppr\" class=\"imageSupprimer\" id=\"suppr_" + a.id + "\" HSPACE=\"5\">"
                    + "</li>";
            }
            document.getElementById("mesArticles").innerHTML = resHTML;
            for (let a of articles) {
                document.getElementById("plusUn_" + a.id).addEventListener("click", plusOuMoinsUn);
                document.getElementById("moinsUn_" + a.id).addEventListener("click", plusOuMoinsUn);
                document.getElementById("suppr_" + a.id).addEventListener("click", supprimer);
            }
            
        })
        .catch((error) => {
            console.log(error);
        });
}

document.getElementById("boutonRechercher").addEventListener("click", rechercher);

//Fonction permettant de rechercher un article dans la liste de ceux de l'API
function rechercher(){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const fetchOptions = {
        method: "GET"
    }
    let nomProduit = document.getElementById("recherche").value;
    fetch(url, fetchOptions)
        .then((response) => {
            return response.json();
        })
        .then((dataJSON) => {
            viderLabel("recherche");
            let produits = dataJSON;
            let resHTML = "Voici les produits correspondants à votre recherche : \n";
            if (nomProduit != ""){;
                for(let p of produits){
                    let nomP = p.nom;
                    nomP = p.nom.toLowerCase();
                    nomProduit = nomProduit.toLowerCase();
                    if(nomP.search(nomProduit)>=0){
                        resHTML =
                            resHTML + "<li class=\"listeElementTrouves\" id=\"element_" + p.id + "\""
                            + "> <a id=\"trouveElement_" + p.id + "\" href=\"#listeElement_" + p.id 
                            + "\">" + p.nom + "</a> </li>";
                    }
                }
                if(resHTML == "Voici les produits correspondants à votre recherche : \n"){
                    resHTML = "Aucun produit dans votre frigo ne correspond à votre recherche";
                }
            }
            else resHTML = "";
            document.getElementById("resultatRecherche").innerHTML= resHTML;

            let itemsListe = document.getElementsByClassName("listeElementTrouves");
            for (i = 0; i < itemsListe.length; i++) {
                let idProduit = itemsListe[i].id.split("_")[1];
                document.getElementById("trouveElement_" + idProduit).addEventListener("click", surligneElement);
            }
        })
        .catch((error) => console.log(error));
}

document.getElementById("recherche").addEventListener("keydown", rechercherEnter);

function rechercherEnter(event){
    if (event.key === "Enter") { 
        event.preventDefault();
        document.getElementById("boutonRechercher").click();
    }
}

function getElementFromAPI(idProduit){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let produit = "";
    const fetchOptions = {
        method: "GET"
    }
    return fetch(url, fetchOptions)
        .then((response) => {
            return response.json();
        })
        .then((dataJSON) => {
            let produits = dataJSON;
            for(let p of produits){
                if (idProduit == p.id){
                    produit = p;
                }
            }
            return produit;
        })
        .catch((error) => console.log(error));
}

async function plusOuMoinsUn(event){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let idBouton = event.target.id;
    let idProduit = idBouton.split("_")[1];
    let produit = await getElementFromAPI(idProduit); 
    if(idBouton.split("_")[0] == "plusUn") produit.qte ++;
    else if(idBouton.split("_")[0] == "moinsUn") produit.qte--;
    if(produit.qte == 0)supprimer(event);
    const fetchOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(produit)
    }
    fetch(url, fetchOptions)
        .then( (response) => {
            return response.json();
        })
        .then( (dataJSON) => {
            listeMesArticles();
        })
        .catch( (error) => console.log(error));
}

// Fonction permettant de supprimer complètement un article quelle que soit sa quantité
function supprimer(event){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let idBouton = event.target.id;
    let idProduit = idBouton.split("_")[1];
    //let produit = await getElementFromAPI(idProduit); 
    const fetchOptions = {
        method: "DELETE",
        headers: myHeaders
    }
    fetch(url + "/" + idProduit, fetchOptions)
        .then( (response) => {
            return response.json();
        })
        .then( (dataJSON) => {
            listeMesArticles();
        })
        .catch( (error) => console.log(error));
}

function capitalize(texte){
    texte = texte.toLowerCase();
    texte = texte.charAt(0).toUpperCase() + texte.slice(1);
    return texte;
}

function viderLabel(labelId){
    document.getElementById(labelId).value = "";
}

function surligneElement(event){
    let idBouton = event.target.id;
    let idProduit = idBouton.split("_")[1];
    let elementListe = document.getElementById("listeElement_" + idProduit);
    elementListe.style.backgroundColor = 'yellow';
    elementListe.style.transitionProperty = 'background-color';
    elementListe.style.transitionDuration = '2s';
    elementListe.addEventListener("transitionend", function() {
        elementListe.style.backgroundColor = 'transparent';
        elementListe.style.transitionProperty = 'background-color';
        elementListe.style.transitionDelay = '1s';
        elementListe.style.transitionDuration = '2s';
    });
}
