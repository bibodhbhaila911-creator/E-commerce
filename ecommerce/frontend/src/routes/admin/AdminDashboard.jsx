import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../../api";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

const AdminDashboard = () => {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));
    axios.get(`${API}/user`).then(res => setUsers(res.data.result));
    axios.get(`${API}/order`).then(res => setOrders(res.data.result));
  }, []);

  // money from orders that are not cancelled
  let totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  let pendingOrders = orders.filter((o) => o.status === "Pending").length;
  let lowStock = products.filter((p) => p.quantity < 5);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-number">Rs. {totalSales}</div>
          <div className="stat-label">Total Sales</div>
        </div>
        <Link to="/admin/orders" className="stat">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Orders ({pendingOrders} pending)</div>
        </Link>
        <Link to="/admin/products" className="stat">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Products</div>
        </Link>
        <Link to="/admin/users" className="stat">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Users</div>
        </Link>
        <Link to="/category" className="stat">
          <div className="stat-number">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </Link>
      </div>

      <div className="admin-panels">
        {/* how many orders are in each status */}
        <div className="admin-box">
          <h3>Orders by Status</h3>
          {STATUSES.map((status) => {
            let count = orders.filter((o) => o.status === status).length;
            let percent = orders.length === 0 ? 0 : (count / orders.length) * 100;
            return (
              <div key={status} className="bar-row">
                <span className={`badge badge-${status}`}>{status}</span>
                <div className="bar"><div className={`bar-fill fill-${status}`} style={{ width: `${percent}%` }} /></div>
                <b>{count}</b>
              </div>
            );
          })}
        </div>

        <div className="admin-box">
          <h3>Low Stock (less than 5)</h3>
          {lowStock.length === 0 && <p className="muted">All products have enough stock 👍</p>}
          {lowStock.map((p) => (
            <div key={p._id} className="detail-row">
              <Link to={`/product/update/${p._id}`}>{p.name}</Link>
              <span className="stock-low">{p.quantity === 0 ? "Out of stock" : p.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="page-header" style={{ marginTop: "28px" }}>
        <h2>Recent Orders</h2>
        <Link to="/admin/orders" className="btn btn-secondary">View All</Link>
      </div>
      {orders.length === 0 && <p className="empty">No orders yet.</p>}
      {orders.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.slice(-5).reverse().map((o) => (
                <tr key={o._id}>
                  <td><b>{o.userName}</b></td>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>Rs. {o.totalPrice}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
