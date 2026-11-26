import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("");

  React.useEffect(() => {
    axios.get(`${API}/order`).then(res => setOrders(res.data.result));
  }, []);

  // admin can change the status straight from the table
  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/order/${id}`, { status });
      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`${API}/order/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
      toast.success("Order Deleted Successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to delete order");
    }
  };

  let shownOrders = orders.filter((o) =>
    (o.userName + " " + o.productName).toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === "" || o.status === filterStatus)
  );

  return (
    <div>
      <div className="page-header">
        <h2>Manage Orders</h2>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search by customer or product..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {shownOrders.length === 0 && <p className="empty">No orders found.</p>}
      {shownOrders.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Address</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shownOrders.map((o) => (
                <tr key={o._id}>
                  <td><b>{o.userName}</b></td>
                  <td>{o.productName}</td>
                  <td>{o.quantity}</td>
                  <td>Rs. {o.totalPrice}</td>
                  <td>{o.address}</td>
                  <td>
                    <select className="status-select" value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => navigate(`/order/${o._id}`)}>View</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(o._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
