import {cartBaseURL, getCartWithProducts} from './modules/displayHelpers.js';
let productsInCart = document.querySelector(".cart-products-container");

 // display content of shopping cart -----------------------------------------
 const displayCartProducts = async () => {
    productsInCart.innerHTML = ""
    let cartProducts = await getCartWithProducts();
    for(let i = 0; i < cartProducts.length; i++) {
       productsInCart.innerHTML += `<div class="product-container__product ${cartProducts[i].id}"><div class="product-container__img-container"><img class="product-container__img" src="${cartProducts[i].imageUrl}"></div><div class="product-container__txt-container"><div class="product-container__txt"><p>${cartProducts[i].name}</p><p>${cartProducts[i].price} SEK</p></div><button class="removeBtn" data-name="${cartProducts[i].id}">Add to cart</button></div></div>`;
   }
   let btnList = document.querySelectorAll(".removeBtn")
   btnList.forEach(btn => {
    btn.style.background = "rgba(255,0,0,0.6)"; 
    btn.innerHTML="Remove from cart";   
    btn.addEventListener('click', removeProductFromCart);
    btn.addEventListener("mouseup", displayCartProducts);
   })
   if(cartProducts.length === 0){
    productsInCart.innerHTML = "There is no selected product."
    productsInCart.style.color = "rgba(255,0,0,0.6)";
   }
}



// remove products from the shopping cart ---------------------------------------------------
const removeProductFromCart = async (event) => {
    const productId = event.target.dataset.name;
    await fetch(cartBaseURL + `/${productId}`, { method: 'DELETE'})
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);  
    }
    );
}


window.onload = displayCartProducts; 