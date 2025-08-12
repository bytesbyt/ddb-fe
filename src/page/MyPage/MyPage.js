import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";
import LoadingSpinner from "../../common/component/LoadingSpinner";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, loading } = useSelector((state) => state.order);
  
  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!orderList || orderList.length === 0) {
    return (
      <Container className="no-order-box">
        <h2>My Orders</h2>
        <div>You have no orders yet.</div>
      </Container>
    );
  }
  
  return (
    <Container className="status-card-container">
      <h2 className="mb-4">My Orders</h2>
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </Container>
  );
};

export default MyPage;
