import { NavLink, Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">🛒 My Shop</Link>
      <div className="nav-links">
        {/* "end" makes Home active only on "/" exactly */}
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/product">Products</NavLink>
        <NavLink to="/category">Categories</NavLink>
        <NavLink to="/user">Users</NavLink>
        <NavLink to="/order">Orders</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
