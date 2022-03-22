

import {Container, Typography, Button, Grid } from '@material-ui/core';
import useStyles from './style';
import React from 'react'

import CartItem from './CartItem/CartItem';
import {Link} from 'react-router-dom';

const Cart = ({ cart }) => {
    
const classes = useStyles();

const EmptyCart = () => (
    <Typography>you have no items in your shopping cart, start adding some!</Typography>
);

const FilledCart = () => (
    <>
    <Grid container spacing={3}>
        {cart.line_items.map((item) => (
            <Grid item xs={12} sm={4} key={item.id}>
                <CartItem item={item}/>
            </Grid>
        ))}
    </Grid>
    <div className={classes.cardDetails}>
        <Typography variant="h4">subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
        <div>
            <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary">Empty CART</Button>
            <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">check out</Button>
        </div>
    </div>

    </>
);

if(!cart.line_items) return 'Loading....';

    return (
       <Container>
           <div className={classes.toolbar}/>
           <Typography className={classes.title}>Your Shopping Cart</Typography>
           {!cart.line_items.length ? <EmptyCart/> : <FilledCart/> }
       </Container>
    )
}

export default Cart;









