import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/services">Services</Link>
      <Link to="/about">About</Link>
    </nav>
  );
};

export default Navbar;
