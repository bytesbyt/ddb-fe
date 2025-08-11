import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";

const OrderCompletePage = () => {
  const { orderNum } = useSelector((state) => state.order);
  if (orderNum === "")
    return (
      <Container className="confirmation-page">
        <h1>Order Failed</h1>
        <div>
          Please go back to the main page
          <Link to={"/"}>Go to Main Page</Link>
        </div>
      </Container>
    );
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>Order Completed!</h2>
      <div>Order Number: {orderNum}</div>
      <div>
        Please check your order in the My Orders menu
        <div className="text-align-center">
          <Link to={"/account/purchase"}>My Orders</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
