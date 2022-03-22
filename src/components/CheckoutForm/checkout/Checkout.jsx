import React,{ useState, useEffect } from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from '@material-ui/core';
import useStyles from './style';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import {Link, useHistory} from 'react-router-dom';

const steps = ["Shipping address", "Payment details"];

const Checkout = ({cart, order, onCaptureCheckout, error}) => {

    const classes = useStyles();
    const [activeSteps, setActiveSteps] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsFinished] = useState(false);
    const history  = useHistory();

     useEffect(() => {
          const generateToken = async () => {
              try {
                  const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
                    setCheckoutToken(token);
                    console.log(checkoutToken);
              } catch(error) {
                  console.log(error);
                  history.pushState('/')
              }
          }  

          generateToken();
     },[])
   
      const nextStep = () => setActiveSteps((prevActiveStep) => prevActiveStep + 1);
      const backStep = () => setActiveSteps((prevActiveStep) => prevActiveStep - 1);

      const next = (data) => {
         setShippingData(data);
          
         nextStep();
     }


   const timeout  = () => {
       setTimeout(() => {
            setIsFinished(true);
       }, 3000)
   }


     let Confirmation = () => order.customer ? (
        <>
          <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
          </div>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
      ) : isFinished ?  (
          <>
        <div>
        <Typography variant="h5">Thank you for your purchase!</Typography>
        <Divider className={classes.divider} />
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </>
    ) : (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
    );
    
      if (error) {
        Confirmation = () => (
          <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </>
        );
      }
    







    const Form = () => activeSteps === 0 ? <AddressForm checkoutToken={checkoutToken} next={next}/> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken}a backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout}/>
    return (
        <>
        <div className={classes.toolbar}/>
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeSteps} className={classes.stepper}>
                    {steps.map((step) => (
                        <Step key={step}>
                               <StepLabel>{step}</StepLabel> 
                        </Step>
                    ))}
                </Stepper>
                {activeSteps === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
                
                
            </Paper>
        </main>


        </>    
        
    )
}

export default Checkout
