import { uiActions } from "./ui-slice";
import { cartAction } from "./cart-slice";

export const sendCartData = (cart) => {
    return async(dispatch) => {
        dispatch(
            uiActions.showNotification({
              status: 'pending',
              title: 'Sending...',
              message: 'Sending cart data',
            })
          );
        const sendRequest = async() => {
            const response = await fetch('https://reduxcart-dc195-default-rtdb.firebaseio.com/cart.json',{
              method: "PUT",
              body: JSON.stringify(cart),
            });
            if(!response.ok){
              throw new Error('Sending cart data failed!');   
            }
        };
        try{
           await sendRequest();           
           dispatch(
            uiActions.showNotification({
              status: 'success',
              title: 'Success!',
              message: 'Cart data sent successfully',
            })
          );
        }
        catch(err){
            dispatch(
                uiActions.showNotification({
                  status: 'error',
                  title: 'Error',
                  message: err.message,
                })
              );
        }  
    }
}

export const fetchCartData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch('https://reduxcart-dc195-default-rtdb.firebaseio.com/cart.json');
            if(!response){
                throw new Error('Error in fetching cart Data!');
            }
            const data = await response.json();
            return data;
        }
        try{
            const cartData = await fetchData();
            dispatch(cartAction.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity
            }));
        }catch (err){
            dispatch(
                uiActions.showNotification({
                  status: 'error',
                  title: 'Error',
                  message: err.message,
                })
              );
        }
    }
}