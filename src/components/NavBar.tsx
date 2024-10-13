import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  LogIn,
  Menu,
  Search,
  ShoppingBag,
  User as UserIcon,
  X
} from "react-feather";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { setIsDrawer } from "../redux/reducer/miscSlice";
import { RootState } from "../redux/store";
import { User } from "../types/types";
import Accordion from "./Accordian";

interface PropsType {
  user: User | null;
}

const NavHeader = ({ user }: PropsType) => {
  const [extrasOpen, setExtrasOpen] = useState<boolean>(false);
  const { isDrawer } = useSelector((state: RootState) => state.misc);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const dispatch = useDispatch();

  // Handle scrolling direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
        setIsNavbarVisible(false); // Scrolling down - hide navbar
      } else {
        setIsNavbarVisible(true); // Scrolling up - show navbar
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isDrawer) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isDrawer]);

  const logoutHandler = async () => {
    setExtrasOpen(false);
    try {
      await signOut(auth);
      toast.success("Signed out Successfully");
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  const handleAccordionClick = (link: string) => {
    setIsMenuOpen(false); // Close the menu
    navigate(link); // Navigate to the link
  };

  const openDrawer = () => {
    dispatch(setIsDrawer(true));
    setExtrasOpen(false);
  };

  return (
    <div
      className={`nav-header ${isDrawer ? "open" : ""} ${
        isNavbarVisible ? "visible" : "hidden"
      }`}
    >
      <div className="nav-header__top">
        <div className="nav-header__logo">
          <NavLink onClick={() => setExtrasOpen(false)} to="/">
            Z<span style={{ color: "var(--black-100)" }}>ylaro</span>
            <span style={{ color: "var(--black-40)" }}>.</span>
          </NavLink>
        </div>
        <div className="link-icons">
          <NavLink
            onClick={() => setExtrasOpen(false)}
            to="/search"
            className="link-contain nav-search"
          >
            <Search className="nav-icon" />
          </NavLink>
          <NavLink
            onClick={() => setExtrasOpen(false)}
            to="/cart"
            className="link-contain nav-cart"
          >
            <ShoppingBag className="nav-icon" />
          </NavLink>
          {user?._id ? (
            <>
              <button
                onClick={() => setExtrasOpen((prev) => !prev)}
                className="no-decor"
              >
                <div className="link-contain nav-user">
                  <UserIcon className="nav-icon" />
                </div>
              </button>
              <dialog open={extrasOpen}>
                <div>
                  {user.role === "admin" && (
                    <NavLink
                      to="admin/dashboard"
                      onClick={() => setExtrasOpen(false)}
                      className="hover-black"
                    >
                      Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/orders"
                    className="hover-black"
                    onClick={() => setExtrasOpen(false)}
                  >
                    Orders
                  </NavLink>
                  <div className="cursor hover-black" onClick={logoutHandler}>
                    Logout
                  </div>
                </div>
              </dialog>
            </>
          ) : (
            <NavLink to="/login" className="link-contain">
              <LogIn className="nav-icon" />
            </NavLink>
          )}
          <div className="nav-header__icon-close">
            {isDrawer ? (
              <div className="link-contain">
                <X
                  className="nav-icon"
                  onClick={() => dispatch(setIsDrawer(false))}
                />
              </div>
            ) : (
              <div className="link-contain">
                <Menu
                  className="nav-icon"
                  onClick={openDrawer}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isDrawer && (
        <div className={`nav-header__menu ${isDrawer ? "open" : ""}`}>
          <Accordion title="Search Product" link="/search" />
          <Accordion title="Manage Cart" link="/cart" />
          <Accordion title="Orders" link="/orders" />
          {user?.role === "admin" && (
            <Accordion title="Dashboard" link="admin/dashboard" />
          )}
          <Accordion title="Logout" link="/" />
        </div>
      )}
    </div>
  );
};

export default NavHeader;
