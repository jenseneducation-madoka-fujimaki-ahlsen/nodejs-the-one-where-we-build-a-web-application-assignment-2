const cartBaseURL = 'http://localhost:8000/api/cart';
const productsBaseURL = 'http://localhost:8000/api/products';
let cartProducts;
let cartProductTotal = document.querySelector(".cartProductTotal");
let isRunning = false;
let removeIsRunning = false;

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

var debounce = (func, delay) => {
    let Timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(Timer);
        Timer = setTimeout(() => func.apply(context, args), delay)
    }
}

const updateButtonStyle = async () => {
    let btnList = document.querySelectorAll(".addBtn")

    if (cartProducts.length !== 0) {
        btnList.forEach(btn => {
            if (cartProducts.some(product => product.id === btn.getAttribute('data-name'))) {
             btn.style.background = "rgb(255, 96, 96)"; 
             btn.innerHTML="Remove from cart";   
             btn.removeEventListener('click', insertHandler);
             btn.addEventListener('click', removeHandler);
            } 
            else {
                btn.style.background = "rgb(12, 97, 226)"; 
                btn.innerHTML="Add to cart";  
                btn.removeEventListener('click', removeHandler);
                btn.addEventListener('click', insertHandler);
            }                
            });
    } else {
        btnList.forEach(btn => {
            btn.style.background = "rgb(12, 97, 226)"; 
            btn.innerHTML="Add to cart";  
            btn.removeEventListener('click', removeHandler);
            btn.addEventListener('click', insertHandler);
        })     
    }
}

// insert products in the shopping cart ----------------------------------------------------
const insertProductInCart = async (event) => {
if (!isRunning){
    isRunning = true;
    const productId = event.target.dataset.name;
    await fetch(cartBaseURL, { method: 'POST',
     headers: new Headers({'Content-Type': 'application/json'}),
     body: JSON.stringify({productId: productId}) })
    .then((response) => {
        return response.json();
    }).then((data) => {
        isRunning = false;
        console.log(data);   
    }); 
    await displayCartProductsTotal(); 
    await updateButtonStyle(); 
}
}

// remove products from the shopping cart ---------------------------------------------------
const removeProductFromCart = async (event) => {
    if (!removeIsRunning){
        removeIsRunning = true;
    const productId = event.target.dataset.name;
    await fetch(cartBaseURL + `/${productId}`, { method: 'DELETE'})
    .then((response) => {
        return response.json();
    }).then((data) => {
        removeIsRunning = false;
        console.log(data);   
    });
    await displayCartProductsTotal(); 
    await updateButtonStyle(); 
}
}

const removeHandler = debounce(removeProductFromCart, 250)
const insertHandler = debounce(insertProductInCart, 250)


export {debounce, cartBaseURL, displayCartProductsTotal, insertProductInCart, removeProductFromCart, getCartWithProducts, updateButtonStyle, getProducts};