const cartBaseURL = 'http://localhost:8000/api/cart';
const productsBaseURL = 'http://localhost:8000/api/products';
let cartProducts;
let cartProductTotal = document.querySelector(".cartProductTotal");

// get all products --------------------------------
const getProducts = async (displayProducts) => {
    return await fetch(productsBaseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => { 
        displayProducts(data);
    });
}

// get the shopping cart with all the added products ----------------------------------------
const getCartWithProducts = async () => {
   return await fetch(cartBaseURL, { method: 'GET' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        cartProducts = data;  
        return cartProducts; 
    });
}

const displayCartProductsTotal = async  () => {
    await getCartWithProducts();
    cartProductTotal.innerHTML = cartProducts.length;
    if(cartProducts.length === 10){
        cartProductTotal.style.right = "10px";
    }else{
        cartProductTotal.style.right = "15px";
    }
}

const updateButtonStyle = async () => {
    let btnList = document.querySelectorAll(".addBtn")

    if (cartProducts.length !== 0) {
        btnList.forEach(btn => {
            if (cartProducts.some(product => product.id === btn.getAttribute('data-name'))) {
             btn.style.background = "rgb(255, 96, 96)"; 
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
    await displayCartProductsTotal(); 
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
    await displayCartProductsTotal(); 
    await updateButtonStyle(); 
}

export {cartBaseURL, displayCartProductsTotal, insertProductInCart, removeProductFromCart, getCartWithProducts, updateButtonStyle, getProducts};