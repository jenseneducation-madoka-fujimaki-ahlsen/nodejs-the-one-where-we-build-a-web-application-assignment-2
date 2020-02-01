const cartBaseURL = 'http://localhost:8000/api/cart';
let cartProducts;
let cartProductNum = document.querySelector(".cartProductNum");

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

const displayCartProductsNum = async  () => {
    await getCartWithProducts();
    cartProductNum.innerHTML = cartProducts.length;
    if(cartProducts.length === 10){
        cartProductNum.style.right = "10px";
    }else{
        cartProductNum.style.right = "15px";
    }
}

const updateButtonStyle = async () => {
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

export {cartBaseURL, displayCartProductsNum, insertProductInCart, removeProductFromCart, getCartWithProducts, updateButtonStyle};