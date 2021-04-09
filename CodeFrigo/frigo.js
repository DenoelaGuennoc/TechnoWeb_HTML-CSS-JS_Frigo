document.getElementById("imageFrigo").addEventListener("click", ouvreFrigo);

//Fonction de changement d'image au clic
//Permet de passer d'un frigo fermé à un frigo ouvert
function ouvreFrigo() {
    let imageActuelle = document.getElementById("imageFrigo");
    if(imageActuelle.src.match("Images/FrigoFerme.png")){
        imageActuelle.src = "Images/FrigoOuvert.png";
        listeMesArticles();
    }
    else {
        imageActuelle.src = "Images/FrigoFerme.png";
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
    let produit = {"nom":nomProduit,"qte":qteProduit};
    const fetchOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(produit)
    }
    fetch(url, fetchOptions)
        .then( (response) => {
        return response.json()
        })
        .then( (dataJSON) => {
            viderLabel("newArticle");
            viderLabel("quantite");
            listeMesArticles();
        })
        .catch( (error) => console.log(error));
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
                    resHTML + "<li id=\"listeElement_" + a.id + "\">" + a.nom
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
            let resHTML = "";
            for(let p of produits){
                let nomP = p.nom;
                nomP = p.nom.toLowerCase();
                nomProduit = nomProduit.toLowerCase();
                if(nomP.search(nomProduit)>=0){
                    resHTML =
                        resHTML + "<li> <a href=\"#listeElement_" + p.id + "\">" + p.nom + "</a> </li>";
                }
            }
            document.getElementById("resultatRecherche").innerHTML= resHTML;
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