import { displayCartProductsNum, insertProductInCart, updateButtonStyle} from './modules/displayHelpers.js';
let displayProducts = document.querySelector(".product-container");
let productNum = document.querySelector(".productNum");
const productsBaseURL = 'http://localhost:8000/api/products';

// get all products and display ------------------------------------------------------------------
const getProducts = async () => {
    await fetch(productsBaseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => { 
        displayProduct(data);
    });
}

const displayProduct = async (products) => {
    productNum.innerHTML += products.length;
     for(let i = 0; i < products.length; i++) {
        displayProducts.innerHTML += `<div class="product-container__product"><div class="product-container__img-container"><img class="product-container__img" src="${products[i].imageUrl}"></div><div class="product-container__txt-container"><div class="product-container__txt"><p>${products[i].name}</p><p>${products[i].price} SEK</p></div><button class="addBtn" data-name="${products[i].id}">Add to cart</button></div></div>`;
    }

    let btnList = document.querySelectorAll(".addBtn")
    btnList.forEach(btn => {
        btn.addEventListener('click', insertProductInCart);
    });

    await displayCartProductsNum();
    await updateButtonStyle();
}

window.onload = getProducts; 
