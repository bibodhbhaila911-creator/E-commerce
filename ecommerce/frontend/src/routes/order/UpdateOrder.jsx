import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const UpdateOrder = () => {
  const [userName, setUserName] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [unitPrice, setUnitPrice] = React.useState(0);
  const [address, setAddress] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/order/${id}`)
      .then(res => {
        const o = res.data.result;
        setUserName(o.userName);
        setProductName(o.productName);
        setQuantity(o.quantity);
        setUnitPrice(o.totalPrice / o.quantity); // price of one item
        setAddress(o.address);
        setStatus(o.status);
      });
  }, [id]);

  let totalPrice = unitPrice * Number(quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/order/${id}`, {
        quantity: Number(quantity), totalPrice, address, status
      });
      toast.success("Order Updated Successfully");
      navigate("/order");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update order");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Edit Order</h2>
      <div className="detail-row"><span>Customer</span><span>{userName}</span></div>
      <div className="detail-row" style={{ marginBottom: "16px" }}><span>Product</span><span>{productName}</span></div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Delivery Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="total-box">Total: Rs. {totalPrice}</div>
      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
};

export default UpdateOrder;
