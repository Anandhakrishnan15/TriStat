import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "./ReusableNavbar.css";

const ReusableNavbar = ({ logo, brand, links, dropdown }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle entire menu (for mobile)
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Toggle dropdown for products
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Handle product click and navigate to dynamic route
  const handleDropdownClick = (path) => {
    navigate(path);
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Handle clicking outside to close menu and dropdown
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Handle resizing (close menu on large screens)
  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setMenuOpen(false);
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="navbar" ref={menuRef}>
      {/* Left Side - Logo & Brand */}
      <div className="logo-container">
        {logo && <img src={logo} alt="Brand Logo" className="logo" />}
        {brand && <h2 className="brand">{brand}</h2>}
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? (
          <FiX size={30} color="#E5D0CF" />
        ) : (
          <FiMenu size={30} color="#E5D0CF" />
        )}
      </div>

      {/* Nav Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <li key={link.name}>
            <NavLink
              to={link.path}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          </li>
        ))}

        {/* Dropdown */}
        {dropdown && (
          <li
            className="nav-item"
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="nav-link" onClick={toggleDropdown}>
              {dropdown.title} ▾
            </span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                {dropdown.items.map((item) => (
                  <li key={item.id}>
                    <span
                      className="dropdown-item"
                      onClick={() => handleDropdownClick(item.path)}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default ReusableNavbar;
// import React from 'react'
// import ReusableNavbar from './ReusableNavbar';

// const Navbar = () => {

// const navLinks = [
//   { name: "Home", path: "/" },
//   { name: "About", path: "/about" },
//   { name: "Resources", path: "/resources" },
//   { name: "Contact", path: "/contact" },
// ];

// const dropdown = {
//   title: "Products",
//   items: [
//     { id: 1, name: "Product 1", path: "/products/1" },
//     { id: 2, name: "Product 2", path: "/products/2" },
//     { id: 3, name: "Product 3", path: "/products/3" },
//   ],
// };

// return (
//   <ReusableNavbar
//     logo="/logo.png"
//     brand="Saiego"
//     links={navLinks}
//     dropdown={dropdown}
//   />
// );
// }

// export default Navbar
