const cat = [`clothes`, `jewels`, `bags`];
const pathImg = `assets/img/`;

class Cart {
    container = document.getElementById(`containerList`); //tbody
    cssDivQte = `input-group-prepend ml-1 ml-auto`;
    cssInput = `form-control inpputSize`;
    csstdTotalE = `text-bold`;
    cssImgDustbin = `click`;
    products = [];
    constructor() {
        this.products = [];
        this.createHTMLCart();
    }
    createHTMLCart() {
        if (this.products.length > 0) { //verifie si le panier contient quelque chose
            this.container.innerHTML = ``;
            for (let index = 0; index < this.products.length; index++) { //boucle pour créer une ligne par article dans le panier
                const element = this.products[index];
                let bodyTr = this.container.appendChild(document.createElement(`tr`));
                let thRefInside = bodyTr.appendChild(document.createElement(`th`));
                let tdName = bodyTr.appendChild(document.createElement(`td`));
                let tdQte = bodyTr.appendChild(document.createElement(`td`));
                let tdDiv = tdQte.appendChild(document.createElement(`div`));
                let tdInput = tdDiv.appendChild(document.createElement(`input`));
                let tdPrice = bodyTr.appendChild(document.createElement(`td`));
                let tdImg = bodyTr.appendChild(document.createElement(`td`));
                let imgDustbin = tdImg.appendChild(document.createElement(`img`));
                //Add classes CSS
                imgDustbin.className = this.cssImgDustbin
                tdDiv.className = this.cssDivQte;
                tdInput.className = this.cssInput;
                //Define Attributes and contents

                tdInput.setAttribute(`aria-label`, `Sizing example input`);
                tdInput.setAttribute(`aria-describedby`, `inputGroup-sizing-sm`);
                tdInput.setAttribute(`type`, `number`);
                tdInput.setAttribute(`value`, element.qty);
                tdInput.setAttribute(`min`, `0`);
                tdInput.setAttribute(`max`, `10`);
                tdInput.setAttribute(`step`, `1`);
                tdInput.setAttribute(`id`, `inputCartQty${element.ref}`);
                imgDustbin.setAttribute(`src`, `assets/img/dustbin.svg`);
                imgDustbin.setAttribute(`id`, `removeFromCart${element.ref}`);
                tdPrice.setAttribute(`id`, `elTotalPrice${element.ref}`);
                //Text
                thRefInside.innerText = element.ref;
                tdName.innerText = element.name;
                tdPrice.innerText = `${element.price*element.qty} XOF`; //calcul et affiche le total par article

                //addEventListener
                tdInput.addEventListener(`change`, function () { //onchange
                    let qty = document.getElementById(this.id).value;
                    let ref = this.id.slice(12);
                    myCart.checkBeforeUpdate(ref, qty, element);
                })

                imgDustbin.addEventListener(`click`, function () { //onclick
                    let ref = this.id.slice(14);
                    let qty = 0;
                    myCart.checkBeforeUpdate(ref, qty, element);

                })
            }

            //TTOTAL
            let bodyTrTotal = this.container.appendChild(document.createElement(`tr`));
            let tdEmpty1 = bodyTrTotal.appendChild(document.createElement(`td`));
            let tdEmpty2 = bodyTrTotal.appendChild(document.createElement(`td`));
            let thTotal = bodyTrTotal.appendChild(document.createElement(`th`));
            let tdTotalE = bodyTrTotal.appendChild(document.createElement(`td`));
            let tdEmpty3 = bodyTrTotal.appendChild(document.createElement(`td`));
            thTotal.setAttribute(`scope`, `col`);
            tdTotalE.setAttribute(`id`, `TotalE`);
            thTotal.innerText = `Total`;
            tdTotalE.innerText = `${this.totalPrice()} XOF`;

            // //Add classes CSS
            tdTotalE.className = this.csstdTotalE;


        } else { //panier vide
            this.container.innerHTML = `<td colspan="5"><h1 class="mx-auto h5">Votre panier est vide !</h1></td>`;
        }
    }

    calcNbArticles() {
        let total = 0;
        this.products.forEach(element => {
            total += element.qty
        });
        return total;
    }

    removeNullFromCart() {
        this.products.forEach(element => {
            if (element.qty === 0) {
                let i = this.products.indexOf(element);
                let test = this.products.splice(i, 1);
            }
        });

    }

    // Verifie si la référence du produit passé en paramètre existe (objet)
    //  => renvoit un array [boolean, index]
    isIncart(e) {
        let result = [false, undefined]; //initialise le resultat
        this.products.forEach(element => { // test les les elements du panier
            if (element.ref == e.ref) {
                let index = this.products.indexOf(element);
                result = [true, index]; //renvoie true et l'index de l'element si déjà dans le panier
            };
        });
        return result; //renvoie la valeur par défaut
    }

    checkBeforeUpdate(ref, qty, element) {
        if (element.qty > 0) {
            for (let index = 0; index < productsArray.length; index++) {
                const e = productsArray[index];
                if (e.ref === ref) {
                    qty = parseInt(qty) - parseInt(element.qty);
                    let incart = this.isIncart(e);
                    if (incart[0] && parseInt(this.products[incart[1]].qty) + parseInt(qty) > 10 || !incart[0] && parseInt(qty) > 10) {
                        $('#alert').modal('show');
                    } else if (element.qty - qty < 0) {
                        $('#noStock').modal('show');
                    } else {
                        this.addToCart(e, qty);

                    }

                };
            }

        }
        this.createHTMLCart();

    }

//vérifie les paramètres à ajouter au panier et informe l'utilisateur 
    checkBeforeToAdd(ref, inputQtyValue) {
        if (inputQtyValue >= 0) {
            if ((inputQtyValue == 0)) {
                inputQtyValue = 1;
            }
            for (let index = 0; index < productsArray.length; index++) {
                const element = productsArray[index];
                if (element.ref === ref) {
                    let incart = this.isIncart(element);
                    //Si article commandé en trop grande quantité (10 max)
                    if (incart[0] && parseInt(this.products[incart[1]].qty) + parseInt(inputQtyValue) > 10 || !incart[0] && parseInt(inputQtyValue) > 10) {
                        $('#alert').modal('show');
                    //si nombre d'article en stock insuffisant
                    } else if (element.qty - inputQtyValue < 0) {
                        $('#noStock').modal('show');
                    //ajout des articles au panier
                    } else {
                        this.addToCart(element, inputQtyValue);
                        $('#article').modal('show');
                    }
                    document.getElementById(`inputCardsQty${ref}`).value = 0;
                };
            }
        }
    }

    // Ajoute l'article et les quantité choisi dans le panier
    addToCart(e, qty) {

        if (e.qty - qty > 0) {


            if (this.products.length > 0) { //vérifie que le panier n'est pas vide
                this.removeNullFromCart();
                let boolIncart = this.isIncart(e)[0]; //vérifie si le produit est déjà dans le panier
                let index = this.isIncart(e)[1]; //récupère l'index si déjà dans le panier
                if (boolIncart) {
                    this.products[index].qty += parseInt(qty); //si déjà dans panier, ajoute les quantités
                    e.qty -= parseInt(qty); //met à jour les stocks 
                } else {
                    let copie = Object.assign({}, e); //sinon, copie l'objet
                    copie.qty = parseInt(qty); //modifie les quantités
                    this.products.push(copie); //ajoute au panier
                    e.qty -= parseInt(qty); //met à jour les stocks
                }

            } else {
                this.products[0] = Object.assign({}, e); //si le panier est vide, ajoute l'article
                this.products[0].qty = parseInt(qty); //et modifie les quantités
                e.qty -= parseInt(qty); //met à jour les stocks
            }
        }
        //Actualise l'affichage
        this.removeNullFromCart();
        let nbArticleHTML = document.getElementById(`nbArticle`);
        nbArticleHTML.innerText = this.calcNbArticles();
        let bagdeStockID = document.getElementById(`badgeStock${e.ref}`);
        bagdeStockID.innerText = `Stock: ${e.qty}`;
    }

    //calcul du total dans le panier
    totalPrice() {
        let result = 0;
        this.products.forEach(e => {
            result += (parseInt(e.qty) * e.price);
        });

        return result;
    }
}


//class product sert à définir nos articles lors de leur création/instanciation
class Product {
    constructor(name, descr, cat, price, ref, imgSrc, qty) {
        this.name = name;
        this.descr = descr;
        this.cat = cat;
        this.ref = ref;
        this.price = price;
        this.imgSrc = `${pathImg}${cat}/${imgSrc}.jpg`;
        this.qty = qty;
    }
}

class CardProduct { //cré les cards
    container = document.getElementById(`cards`);
    cssCardCol = `col-12 col-md-6 col-lg-4 mt-2`;
    cssCard = `card shadow p-3 mb-5 bg-white rounded`;
    cssImg = `card-img-top`;
    cssCardBody = `card-body`;
    cssCat = `badge badge-info`;
    cssH1 = `card-title h4`;
    cssP = `card-text`;
    cssPriceTxt = `h5 text-right`;
    cssPriceBadge = `badge badge-primary p-2 my-auto`;
    cssDivContQty = `input-group input-group-sm my-3`;
    cssDivChildQty = `input-group-prepend ml-1 ml-auto`;
    cssInputTxt = `input-group-text`;
    cssInputQty = `form-control inputSize`;
    cssBtn = `btn btn-dark m-1 w-100`;
    cssStockTxt = `h5 text-right`;
    cssStockBadge = `badge badge-secondary p-1 my-auto`;
    createHTMLCard() {
        //create and append Html elements
        let divCol = this.container.appendChild(document.createElement(`div`));
        let divCard = divCol.appendChild(document.createElement(`div`));
        let imgProduct = divCard.appendChild(document.createElement(`img`));
        let divCarddBody = divCard.appendChild(document.createElement(`div`));
        let pCat = divCarddBody.appendChild(document.createElement(`p`));
        let h1Product = divCarddBody.appendChild(document.createElement(`h1`));
        let pDescr = divCarddBody.appendChild(document.createElement(`p`));
        let stockTxt = divCarddBody.appendChild(document.createElement(`h2`));
        let stockBadge = stockTxt.appendChild(document.createElement(`span`));
        let priceTxt = divCarddBody.appendChild(document.createElement(`h2`));
        let priceBadge = priceTxt.appendChild(document.createElement(`span`));
        let divContQty = divCarddBody.appendChild(document.createElement(`div`));
        let divChildQty = divContQty.appendChild(document.createElement(`div`));
        let inputTxt = divChildQty.appendChild(document.createElement(`span`));
        let inputQty = divChildQty.appendChild(document.createElement(`input`));
        let btnAddToCard = divCarddBody.appendChild(document.createElement(`button`));

        //Define Attributes and contents
        divCard.setAttribute(`data-aos`, `zoom-in`);
        imgProduct.setAttribute(`src`, this.product.imgSrc);
        imgProduct.setAttribute(`alt`, `Photo du produit : ${this.product.name}.jpg`);
        pCat.innerText = this.product.cat;
        h1Product.innerText = this.product.name;
        pDescr.innerText = this.product.descr;
        stockBadge.innerText = `Stock: ${this.product.qty}`;
        stockBadge.setAttribute(`id`, `badgeStock${this.product.ref}`);
        priceBadge.innerText = `${this.product.price} XOF`;
        inputTxt.innerText = `Qté`;
        inputQty.setAttribute(`aria-label`, `Sizing example input`);
        inputQty.setAttribute(`aria-describedby`, `inputGroup-sizing-sm`);
        inputQty.setAttribute(`type`, `number`);
        inputQty.setAttribute(`value`, `0`);
        inputQty.setAttribute(`min`, `0`);
        inputQty.setAttribute(`max`, `10`);
        inputQty.setAttribute(`step`, `1`);
        inputQty.setAttribute(`id`, `inputCardsQty${this.product.ref}`);
        btnAddToCard.setAttribute(`id`, `btnAddToCart${this.product.ref}`);
        btnAddToCard.innerText = `Ajouter au panier`;
        btnAddToCard.addEventListener(`click`, function () {
            let ref = this.id.slice(12);
            let inputQtyValue = document.getElementById(`inputCardsQty${ref}`).value;
            myCart.checkBeforeToAdd(ref, inputQtyValue);
        });

        //Francise les badges "catégories"
        if (this.product.cat == `jewels`) {
            pCat.innerText = `Telephone`;
        } else if (this.product.cat == `clothes`) {
            pCat.innerText = `Ordinateur`;
        } else if (this.product.cat == `bags`) {
            pCat.innerText = `Accessoire`;
        }


        //Add classes CSS
        divCol.className = this.cssCardCol;
        divCard.className = this.cssCard;
        imgProduct.className = this.cssImg;
        divCarddBody.className = this.cssCardBody;
        pCat.className = this.cssCat;
        h1Product.className = this.cssH1;
        pDescr.className = this.cssP;
        priceTxt.className = this.cssPriceTxt;
        priceBadge.className = this.cssPriceBadge;
        divContQty.className = this.cssDivContQty;
        divChildQty.className = this.cssDivChildQty;
        inputTxt.className = this.cssInputTxt;
        inputQty.className = this.cssInputQty;
        btnAddToCard.className = this.cssBtn;
        stockTxt.className = this.cssStockTxt;
        stockBadge.className = this.cssStockBadge;
    }

    constructor(product) {
        this.product = product; //objet de la liste des produits dans productsArray
        this.createHTMLCard();
    }
}

//cré le panier
const myCart = new Cart(); 
//création des ojects produits dans un tableau
const productsArray = [];
productsArray[0] = new Product(`Ivents Max 9`, `Invens Max 9 - Ecran 5.5" - RAM 2Go - ROM 16Go - Caméra Avant 2.0 Mpx - Batterie 3500 mAh + Écouteurs Bluetooth Offert - Noir`, cat[1], 44900, `02323`, `ivens`, 50);
productsArray[1] = new Product(`Tecno`, `Tecno Phantom 9 - 4G - Double SIM - 6,4 po FHD- 128GB - RAM 6GB - 3 caméras arrière de 16 MP + 2 MP + 8 MP avec quadruple flash- 3500mAh - Garantie 13 mois.`, cat[1], 141000, `02328`, `tecno`, 45);
productsArray[2] = new Product(`Samsung`, `Samsung A21s (2020) - 6.5" HD+ - ROM 64Go - RAM 4Go - Bleu`, cat[1], 170000, `02332`, `A21`, 100);
productsArray[3] = new Product(`Iphone`, `Generic IPhone 4s 3.7 pouces 512 Rom + 32 Go 5MP + 1.75 m de pixels - Blanc/White.`, cat[1], 37000, `02329`, `i4`, 60);
productsArray[4] = new Product(`Samsung A31`, `Samsung A31 (2020) - 6.4" FHD+ - ROM 128Go - RAM 4Go - Caméra arrière Quadruple 48.0 MP + 5.0 MP + 8.0 MP + 5.0 MP - Caméra Avant 20 MP - Batterie 5000mAh - Bleu - Garantie 24 mois.`, cat[1], 145000, `02326`, `A31`, 57);
productsArray[5] = new Product(`Infinix`, `Infinix S5 Lite - 4G - Ecran 6.6’’HD+ ROM 64Go - RAM 4Go - Caméra 16 + 2 Mp - Cyan. `, cat[1], 83500, `02335`, `infi`, 18);
productsArray[6] = new Product(`Iphone 7 plus`, `Apple IPhone 7 Plus - 5.5'' - 256GB ROM + 3GB RAM - Refurbished Smartphone - Red.`, cat[1], 379000, `09323`, `i7`, 13);
productsArray[7] = new Product(`Apple Watch`, `Apple Apple Watch Series 4 - GPS - Aluminium - Gris Sidéral - Sport - Noir - 44 mm`, cat[2], 425000, `12895`, `whatch`, 90);
productsArray[8] = new Product(`Montre Bluetooth`, `Generic Bluetooth Montre Smart Watch Hommes Femmes Sport Q18 Facebook Whatsapp Sync SMS Smartwatch Soutien SIM TF Carte pour xiaomi huawei téléphone a1.`, cat[2], 23000, `12892`, `montre`, 82);
productsArray[9] = new Product(`Ecouteur Bluetooth`, `Qcy T5 - Écouteurs Intra-auriculaires Binauraux Stéréo Bluetooth 5.0 à Charge Sans Fil - Noir.`, cat[2], 17000, `12887`, `ecout`, 9);
productsArray[10] = new Product(`Coque Iphone`, `Generic Coque Silicone pour iPhone X - Rouge.`, cat[2], 2000, `12889`, `cok7`, 19);
productsArray[11] = new Product(`Laptop`, `Generic Xiaomi Mi Gaming Laptop 15.6 Inch i5-8300H GTX1060 8GB DDR4.`, cat[0], 2220773, `17839`, `laptop`, 75);
productsArray[12] = new Product(`Ordinateur Dell`, `DELL Ordinateur Portable - Ecran 15.6" - INTEL CELERON DUO - RAM 4 Go - ROM 500 Go - Noir.`, cat[0], 229000, `168500`, `del`, 44);
productsArray[13] = new Product(`Hp`, `Hp Pc Portable - 15-ra000nk - Ecran 15.6" - Dual Core - RAM 4GB - Stockage 500 GB - Noir`, cat[0], 164950, `17359`, `Hp`, 46);
productsArray[14] = new Product(`Hp Lonovo`, `avec un écran 15,6 pouces, 16 Go de RAM, un SSD d'1 To, ainsi qu'une carte graphique Nvidia GeForce GTX1660Ti.`, cat[0], 359000, `17119`, `Hp Lonovo`, 10);
productsArray[15] = new Product(`Ordinateur Mac`, `Macbook Air Core i7 Ram 8Go, Disque dur SSD 256 Go, Carte Graphique intel HD 400 1536mo dédié, Ecran 13 pouces en excellent état, autonomie batterie 8H..`, cat[0], 250000, `17923`, `Macbook`, 84);
productsArray[16] = new Product(`Asus Portable`, `Ecran 15.6" - Stockage 500Go - 4Go RAM - Dual Core - Emprunte Digitale + Sac,Souris,Clé Usb 16Go.`, cat[0], 182000, `17383`, `asus`, 84);

//création des cards dans un tableau
//cré dynamiquement les cards en html par cetégorie cliquée dans navBar
let cardsArray = [];
let nBtn = document.getElementsByClassName('nav-item nav-link text-white');
let cards = document.getElementById(`cards`);
for (let i = 0; i < nBtn.length; i++) {
    nBtn[i].addEventListener('click', function showProducts() {
        let idCatData = document.getElementById(this.id);
        let catData = idCatData.dataset.cat;
        cards.innerHTML = '';
        cardsArray = [];
        productsArray.forEach(element => {
            if (element.cat === catData) {
                cardsArray.push(new CardProduct(element));
            }
        })
    })
}

//affichage aléatoire des produits au chargement de la page
var i, j, k;
for (i = productsArray.length - 1; i > 0; i--) { //boucle random method fisher yates. Mélange l'ordre des articles dans le array
    j = Math.floor(Math.random() * i)
    k = productsArray[i]
    productsArray[i] = productsArray[j]
    productsArray[j] = k
}

for (let index = 0; index < 9; index++) { //boucle pour créer nos cards avec les 9 premiers articles
    const element = productsArray[index];
    cardsArray.push(new CardProduct(element));
}


//Jquery => reduit la navbar bootstrap au click sur les liens

$('.navbar-nav>a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
});