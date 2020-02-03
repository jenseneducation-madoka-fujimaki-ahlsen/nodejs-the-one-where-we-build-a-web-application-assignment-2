import {debounce, cartBaseURL, getCartWithProducts} from './modules/displayHelpers.js';
let cartProductsContainer = document.querySelector(".cart-products-container");
let productId ;

 // display the shopping cart with all the added products --------------------------------------
 const displayCartProducts = async () => {
    cartProductsContainer.innerHTML = ""
    let priceSum = 0;
    let cartProducts = await getCartWithProducts();
    for(let i = 0; i < cartProducts.length; i++) {
       cartProductsContainer.innerHTML += `<div class="product-container__product ${cartProducts[i].id}"><div class="product-container__img-container"><img class="product-container__img" src="${cartProducts[i].imageUrl}"></div><div class="product-container__txt-container"><div class="product-container__txt"><p>${cartProducts[i].name}</p><p>${cartProducts[i].price} SEK</p></div><button class="removeBtn" data-id="${cartProducts[i].id}">Remove from cart</button></div></div>`;
       priceSum += cartProducts[i].price;
   }
   cartProductsContainer.innerHTML += `<hr class="line"><p class="totalPrice">Total : ${priceSum} SEK</p>`;
   let btnList = document.querySelectorAll(".removeBtn")
   btnList.forEach(btn => {
    btn.style.background = "rgba(255,0,0,0.6)"; 
    btn.innerHTML="Remove from cart";   
    btn.addEventListener('click', debounce(updateButtonMsg, 250));
   })
   if(cartProducts.length === 0){
    cartProductsContainer.innerHTML = "You have no product in your cart."
    cartProductsContainer.style.color = "rgba(255,0,0,0.6)";
   }
}

// remove products from the shopping cart ---------------------------------------------------
const updateButtonMsg = event => {
    event.preventDefault();
    productId = event.target.dataset.id;
    let btn = document.querySelectorAll(`[data-id='${productId}']`)
    btn[0].classList.add('animated');
    setTimeout(removeProductFromCart, 600);
};

const removeProductFromCart =  () => {
    fetch(cartBaseURL + `/${productId}`, { method: 'DELETE'})
   .then((response) => {
       return response.json();
   }).then((data) => {
       console.log(data);  
       if(data.success){
           setInitialButtonState();         
       }
   }
   );
}

const setInitialButtonState = () => {
    let btn = document.querySelectorAll(`[data-id='${productId}']`)
    btn[0].classList.remove('animated');
    displayCartProducts();
};

window.onload = displayCartProducts; 