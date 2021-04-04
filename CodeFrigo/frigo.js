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
            listeMesArticles();
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
                    + "<button id=\"plusUn_" + a.id + "\" " + "name=\"plusUn\">+1</button>"
                    + " <button id=\"moinsUn_" + a.id + "\" " + "name=\"moinsUn\">-1</button>"
                    + " <button id=\"suppr_" + a.id + "\" " + "name=\"supprimer\">Supprimer</button>"
                    + "</li>";
                
            }
            document.getElementById("mesArticles").innerHTML = resHTML;
            for (let a of articles) {
                document.getElementById("plusUn_" + a.id).addEventListener("click", plusOuMoinsUn);
                document.getElementById("moinsUn_" + a.id).addEventListener("click", plusOuMoinsUn);
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
            let produits = dataJSON;
            let resHTML = "";
            for(let p of produits){
                let nomP = p.nom;
                nomP = p.nom.toLowerCase();
                nomProduit = nomProduit.toLowerCase();
                if(nomP.search(nomProduit)>=0){
                    resHTML =
                        resHTML + "<li id=" + p.id + "ID >" + p.nom + " (" + p.qte + ")"
                        + "<button id=\"plusUn\" name=\"plusUn\">+1</button>"
                        + " <button id=\"moinsUn\" name=\"moinsUn\">-1</button>"
                        + " <button id=\"suppr\" name=\"supprimer\">Supprimer</button>"
                        + "</li>";
                }
            }
            document.getElementById("mesArticles").innerHTML= resHTML;
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