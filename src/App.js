import React,{ useState, useEffect } from 'react';

import Products from './components/Products';
import Navbar from './components/Navbar/Navbar';

import { commerce } from './lib/commerce';
import Cart from './components/Cart/Cart';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Checkout from './components/CheckoutForm/checkout/Checkout';



const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }
   
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve())
    }

    const handleAddtoCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity)
        setCart(item.cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
    
        setCart(newCart);
      };



    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
          const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
    
          setOrder(incomingOrder);
    
          refreshCart();
        } catch (error) {
          setErrorMessage(error.data.error.message);
        }
      };


    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);




    return (  
    <Router>
        <div>
            <Navbar totalItems={cart.total_items}/>
            <Switch>
                  <Route exact path = "/">
                     <Products products={products} onAddToCart={handleAddtoCart}/> 
                 </Route>
                 <Route exact path = "/cart">
                    <Cart cart={cart}/>
                </Route>
                <Route exact path="/checkout">
                    <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>
                </Route>
           </Switch>
        </div>
     </Router>
    )
}

export default App
