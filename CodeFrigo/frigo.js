document.getElementById("frigo").addEventListener("click", ouvreFrigo);

//Fonction de changement d'image au clic
//Permet de passer d'un frigo fermé à un frigo ouvert
function ouvreFrigo() {
    let imageActuelle = document.getElementById("frigo");
    if(imageActuelle.src.match("Images/FrigoFerme.png")){
        imageActuelle.src = "Images/FrigoOuvert.png";
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
        })
        .catch( (error) => console.log(error));
}

document.getElementById("frigo").addEventListener("click", listeMesArticles);

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
                    resHTML + "<li>" + a.nom + " (" + a.qte + ")"
                    + "<button id=\"plusUn\" name=\"plusUn\">+1</button>"
                    + " <button id=\"moinsUn\" name=\"moinsUn\">-1</button>"
                    + " <button id=\"suppr\" name=\"supprimer\">Supprimer</button>"
                    + "</li>";
            }
            document.getElementById("mesArticles").innerHTML = resHTML;
        })
        .catch((error) => {
            console.log(error);
        });
}

document.getElementById("boutonRechercher").addEventListener("click", rechercher);
document.getElementById("recherche").addEventListener("keyup", rechercher(event));

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
            let produits = dataJSON;
            let resHTML = "";
            for(let p of produits){
                let nomP = p.nom;
                nomP = p.nom.toLowerCase();
                nomProduit = nomProduit.toLowerCase();
                if(nomP.search(nomProduit)>=0 /*p.nom === nomProduit*/){
                    resHTML =
                        resHTML + "<li>" + p.nom + " (" + p.qte + ")"
                        + "<button id=\"plusUn\" name=\"plusUn\">+1</button>"
                        + " <button id=\"moinsUn\" name=\"moinsUn\">-1</button>"
                        + " <button id=\"suppr\" name=\"supprimer\">Supprimer</button>"
                        + "</li>";
                }
            }
            document.getElementById("resultatRecherche").innerHTML= resHTML;
        })
        .catch((error) => console.log(error));
}

//à corriger
/*
function rechercher(event){
    if (event.code === 'Enter') { 
        event.preventDefault();
        document.getElementById("boutonRechercher").click();
    }
}
*/
/*
document.getElementById("plusUn").addEventListener("click", ajouteUn);

function ajouteUn(){
    
}*/

/*
document.getElementById("recherche").addEventListener("input", preciseRecherche);
function preciseRecherche(){
    const url = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/24/produits";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const fetchOptions = {
        method: "GET"
    }

}
*/