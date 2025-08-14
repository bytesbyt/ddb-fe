import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  // Check if any item in cart has insufficient stock
  const hasInsufficientStock = cartList && cartList.some(item => {
    const stockQuantity = item.productId.stock ? item.productId.stock[item.size] || 0 : 0;
    return stockQuantity < item.qty;
  });

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">Order Summary</h3>
      <ul className="receipt-list">
        {cartList && cartList.length > 0 ? (
          cartList.map((item) => {
            const stockQuantity = item.productId.stock ? item.productId.stock[item.size] || 0 : 0;
            const hasStock = stockQuantity >= item.qty;
            
            return (
              <li key={item._id}>
                <div className="display-flex space-between">
                  <div>
                    <div>{item.productId.name}</div>
                    <div>Size: {item.size.toUpperCase()}</div>
                    <div>Qty: {item.qty}</div>
                    {!hasStock && (
                      <div style={{ color: 'red', fontSize: '12px' }}>
                        Out of stock
                      </div>
                    )}
                  </div>
                  <div>£ {currencyFormat(item.productId.price * item.qty)}</div>
                </div>
              </li>
            );
          })
        ) : (
          <li>
            <div>Cart is empty</div>
          </li>
        )}
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>£ {currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && (
        <>
          {hasInsufficientStock && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              <strong> Some items in your cart are out of stock</strong>
              <br />
              Please remove or update quantities before checkout
            </div>
          )}
          <Button
            variant="dark"
            className="payment-button"
            onClick={() => navigate("/payment")}
            disabled={!cartList || cartList.length === 0}
          >
            Proceed to Payment
          </Button>
        </>
      )}

      <div>
        Please note that prices and shipping costs are not confirmed until you reach the payment stage.
        <div>
          Read about our 30-day return policy, return fees, and additional shipping costs for non-delivery.
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
