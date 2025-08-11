import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../../common/component/LoadingSpinner";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, totalPageNum, loading } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const name = query.get("name");
  const page = query.get("page") || 1;

  useEffect(() => {
    dispatch(
      getProductList({
        page: page,
        name: name || "",
      })
    );
  }, [query, dispatch]);

  const handlePageClick = ({ selected }) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", selected + 1);
    if (name) {
      searchParams.set("name", name);
    }
    navigate("?" + searchParams.toString());
  };

  return (
    <>
      <div className="hero-video-container">
        <video 
          className="hero-video"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source 
            src="https://www.net-a-porter.com/content/images/cms/ycm/resource/blob/2672014/5b3241fab57780626773d957e6dfdece/desktop-video-data.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <Container>
        <Row>
        {loading ? (
          <LoadingSpinner />
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" || name === null ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      {productList.length > 0 && totalPageNum > 1 && (
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPageNum}
          forcePage={page - 1}
          previousLabel=""
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item previous"
          previousLinkClassName="page-link"
          nextClassName="page-item next"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item break"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          disabledClassName="disabled"
        />
      )}
    </Container>
    </>
  );
};

export default LandingPage;
