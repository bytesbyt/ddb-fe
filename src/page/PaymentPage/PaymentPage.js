import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  // console.log("shipInfo", shipInfo);

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
    if (firstLoading) { // when useEffect is called for the first time, stops it from navigating to the success page
      setFirstLoading(false);
    } else {
      if (orderNum !== "") {
        navigate("/payment/success");

    }
   
    }
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check if any item has insufficient stock before submitting
    const hasInsufficientStock = cartList.some(item => {
      const stockQuantity = item.productId.stock ? item.productId.stock[item.size] || 0 : 0;
      return stockQuantity < item.qty;
    });
    
    if (hasInsufficientStock) {
      alert("Some items in your cart are out of stock. Please go back to cart and update quantities.");
      navigate("/cart");
      return;
    }
    
    // 오더 생성하기
    const {firstName, lastName, contact, address, city, postalCode} = shipInfo;
    const shipTo = {
      address: address,
      city: city,
      postalCode: postalCode,
    }
    const contactInfo = {
      firstName: firstName,
      lastName: lastName,
      contact: contact,
    }
    const orderList = cartList.map((item) => {
      return {
      productId: item.productId._id,
      price: item.productId.price,
      qty: item.qty,
      size: item.size,
    }});
    dispatch(createOrder({ totalPrice, shipTo, contactInfo, orderList }));
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const { name, value } = event.target;
    setShipInfo({ ...shipInfo, [name]: value });
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const { name, value } = event.target;
    if (name === "expiry") {
      let newValue = cc_expires_format(value);
      setCardValue({ ...cardValue, [name]: newValue });
      return;
    }
    setCardValue({ ...cardValue, [name]: value });
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
  if (cartList?.length === 0) {
    navigate("/cart");
  }
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">Shipping Address</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    placeholder=""
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="postalCode"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
                </div>
                <div>
                  <h2 className="payment-title">Payment Information</h2>
                  <PaymentForm
                    cardValue={cardValue}
                    handlePaymentInfoChange={handlePaymentInfoChange}
                    handleInputFocus={handleInputFocus}
                  />
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  Proceed to Payment
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
