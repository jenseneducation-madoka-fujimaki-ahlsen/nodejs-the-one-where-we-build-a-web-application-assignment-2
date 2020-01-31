let displayProducts = document.querySelector(".product-container");
let cartProductNum = document.querySelector(".cartProductNum");
let productNum = document.querySelector(".productNum");
let displayCartProducts = document.querySelector(".cart-products-container");
const productsBaseURL = 'http://localhost:8000/api/products';
const cartBaseURL = 'http://localhost:8000/api/cart';
let products ;
let cartProducts ;

// get all products and display ------------------------------------------------------------------
const getProducts = () => {
    fetch(productsBaseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        products = data;
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

// get the shopping cart with all the added products ----------------------------------------
getCartWithProducts = async () => {
    await fetch(cartBaseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        cartProducts = data;   
    });
}

displayCartProductsNum = async  () => {
    await getCartWithProducts();
    cartProductNum.innerHTML = cartProducts.length;
    if(cartProducts.length === 10){
        cartProductNum.style.right = "10px";
    }else{
        cartProductNum.style.right = "15px";
    }
}

updateButtonStyle = () => {
    let btnList = document.querySelectorAll(".addBtn")

    if (cartProducts.length !== 0) {
        btnList.forEach(btn => {
            if (cartProducts.some(product => product.id === btn.getAttribute('data-name'))) {
             btn.style.background = "rgba(255,0,0,0.6)"; 
             btn.innerHTML="Remove from cart";   
             btn.removeEventListener('click', insertProductInCart);
             btn.addEventListener('click', removeProductFromCart);
            } 
            else {
                btn.style.background = "rgb(12, 97, 226)"; 
                btn.innerHTML="Add to cart";  
                btn.removeEventListener('click', removeProductFromCart);
                btn.addEventListener('click', insertProductInCart);
            }                
            });
    } else {
        btnList.forEach(btn => {
            btn.style.background = "rgb(12, 97, 226)"; 
            btn.innerHTML="Add to cart";  
            btn.removeEventListener('click', removeProductFromCart);
            btn.addEventListener('click', insertProductInCart);
        })     
    } 
}

// insert products in the shopping cart ----------------------------------------------------
const insertProductInCart = async (event) => {
    const productId = event.target.dataset.name;
    await fetch(cartBaseURL, { method: 'POST',
     headers: new Headers({'Content-Type': 'application/json'}),
     body: JSON.stringify({productId: productId}) })
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);   
    }); 
    await displayCartProductsNum(); 
    await updateButtonStyle(); 
}

// remove products from the shopping cart ---------------------------------------------------
const removeProductFromCart = async (event) => {
    const productId = event.target.dataset.name;
    await fetch(cartBaseURL + `/${productId}`, { method: 'DELETE'})
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);   
    });
    await displayCartProductsNum(); 
    await updateButtonStyle(); 
}

 // display content of shopping cart -----------------------------------------

//  const displayCartProducts = async (cartProducts) => {
//      for(let i = 0; i < cartProducts.length; i++) {
//         displayCartProducts.innerHTML += `<div class="product-container__product"><div class="product-container__img-container"><img class="product-container__img" src="${products[i].imageUrl}"></div><div class="product-container__txt-container"><div class="product-container__txt"><p>${products[i].name}</p><p>${products[i].price} SEK</p></div><button class="addBtn" data-name="${products[i].id}">Add to cart</button></div></div>`;
//     }

//     let btnList = document.querySelectorAll(".addBtn")
//     btnList.forEach(btn => {
//         btn.addEventListener('click', insertProductInCart);
//     });

//     await updateButtonStyle();
// }