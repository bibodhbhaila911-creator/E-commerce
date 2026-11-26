import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);

  // read all 4 collections to show the counts on the dashboard
  React.useEffect(() => {
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));
    axios.get(`${API}/user`).then(res => setUsers(res.data.result));
    axios.get(`${API}/order`).then(res => setOrders(res.data.result));
  }, []);

  // total money from all orders that are not cancelled
  let totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div>
      <div className="hero">
        <h2>Welcome to My Shop</h2>
        <button className="btn" onClick={() => navigate("/product")}>Start Shopping →</button>
      </div>

      <div className="stats">
        <Link to="/product" className="stat">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Products</div>
        </Link>
        <Link to="/category" className="stat">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </Link>
        <Link to="/user" className="stat">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Users</div>
        </Link>
        <Link to="/order" className="stat">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Orders</div>
        </Link>
        <div className="stat">
          <div className="stat-number">Rs. {totalSales}</div>
          <div className="stat-label">Total Sales</div>
        </div>
      </div>

      <div className="page-header">
        <h2>Latest Products</h2>
        <Link to="/product" className="btn btn-secondary">View All</Link>
      </div>
      {products.length === 0 && <p className="empty">No products yet. Add a category, then add products.</p>}
      <div className="grid">
        {products.slice(-4).reverse().map((value, i) => (
          <div key={i} className="card">
            {value.image
              ? <img src={value.image} alt={value.name} className="product-img" />
              : <div className="no-img">📦</div>}
            <span className="badge">{value.category}</span>
            <h3 style={{ marginTop: "8px" }}>{value.name}</h3>
            <p className="price">Rs. {value.price}</p>
            <button className="btn btn-primary" onClick={() => navigate(`/product/${value._id}`)}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
