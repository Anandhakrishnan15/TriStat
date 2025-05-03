import React from 'react'
import ReusableNavbar from './ReusableNavbar';

const Navbar = () => {

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Resources", path: "/resources" },
  { name: "Contact", path: "/contact" },
];

const dropdown = {
  title: "Products",
  items: [
    { id: 1, name: "Product 1", path: "/products/1" },
    { id: 2, name: "Product 2", path: "/products/2" },
    { id: 3, name: "Product 3", path: "/products/3" },
  ],
};

return (
  <ReusableNavbar
    // logo="/logo.png"
    brand="TriStat"
    links={navLinks}
    // dropdown={dropdown}
  />
);
}

export default Navbar
