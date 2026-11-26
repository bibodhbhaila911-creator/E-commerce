import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const ReadallOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("");

  React.useEffect(() => {
    axios.get(`${API}/order`).then(res => setOrders(res.data.result));
  }, []);

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

  const handleDelivered = async (id) => {
    try {
      await axios.patch(`${API}/order/${id}`, { status: "Delivered" });
      setOrders(orders.map((o) => (o._id === id ? { ...o, status: "Delivered" } : o)));
      toast.success("Order Marked as Delivered");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update order");
    }
  };

  let shownOrders = orders.filter((o) => filterStatus === "" || o.status === filterStatus);

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
        <button className="btn btn-primary" onClick={() => navigate("/order/create")}>+ Place Order</button>
      </div>

      <div className="toolbar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: "250px" }}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {shownOrders.length === 0 && <p className="empty">No orders found.</p>}
      {shownOrders.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shownOrders.map((value, i) => (
                <tr key={i}>
                  <td><b>{value.userName}</b></td>
                  <td>{value.productName}</td>
                  <td>{value.quantity}</td>
                  <td>Rs. {value.totalPrice}</td>
                  <td><span className={`badge badge-${value.status}`}>{value.status}</span></td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => navigate(`/order/${value._id}`)}>View</button>
                      <button className="btn btn-secondary" onClick={() => navigate(`/order/update/${value._id}`)}>Edit</button>
                      {value.status !== "Delivered" && value.status !== "Cancelled" && (
                        <button className="btn btn-success" onClick={() => handleDelivered(value._id)}>Mark as Delivered</button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(value._id)}>Delete</button>
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

export default ReadallOrder;
