import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [query] = useSearchParams();
  const [keyword, setKeyword] = useState(query.get("name") || "");
  const menuList = [
    "White Wine",
    "Red Wine",
    "Orange Wine",
    "Rose",
    "Wine Subscription",
    "Wholesale",
  ];
  const rightMenuList = ["Newsletter", "Our Story"];
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    setKeyword(query.get("name") || "");
  }, [query]);

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/?page=1");
      }
      navigate(`/?page=1&name=${event.target.value}`);
    }
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="navbar-wrapper">
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>
        <div className="side-menu-logo">
          <Link to="/" onClick={() => setWidth(0)}>
            <img src="/image/ddb_logo2.png" alt="DDB" />
          </Link>
        </div>
        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
          <div className="side-menu-divider"></div>
          {rightMenuList.map((menu, index) => (
            <button key={`right-${index}`}>{menu}</button>
          ))}
        </div>
      </div>

      <div className="navbar-container">
        {user && user.level === "admin" && (
          <div className="nav-admin-row">
            <Link to="/admin/product?page=1" className="admin-link">Admin</Link>
          </div>
        )}
        
        <div className="nav-top-row">
          <div className="burger-menu hide">
            <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
          </div>
          
          <div className="nav-logo">
            <Link to="/">
              <img src="/image/DDB_logo_black.png" alt="DDB" />
            </Link>
          </div>

          <div className="nav-search">
            {!isMobile && (
              <div className="search-box">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  placeholder="Search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyPress={onCheckEnter}
                />
              </div>
            )}
          </div>

          <div className="nav-icons-section">
            {user ? (
              <div onClick={handleLogout} className="nav-icon-with-text">
                <FontAwesomeIcon icon={faUser} />
                <span>Logout</span>
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon-with-text">
                <FontAwesomeIcon icon={faUser} />
                <span>Login</span>
              </div>
            )}
            
            <div onClick={() => navigate("/cart")} className="nav-icon cart-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </div>
            
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
            </div>
            
          </div>
        </div>

        <div className="nav-bottom-row">
          <div className="mobile-search-container">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyPress={onCheckEnter}
              />
            </div>
          </div>
          <div className="nav-menu-left">
            <ul className="menu">
              {menuList.map((menu, index) => (
                <li key={index}>
                  <span className="menu-link">{menu}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-menu-right">
            <ul className="menu">
              {rightMenuList.map((menu, index) => (
                <li key={index}>
                  <span className="menu-link">{menu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;