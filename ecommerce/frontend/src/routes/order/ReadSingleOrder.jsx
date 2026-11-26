import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api";

const ReadSingleOrder = () => {
  const [order, setOrder] = React.useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/order/${id}`)
      .then(res => setOrder(res.data.result));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h2>Order Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/order")}>← Back</button>
      </div>
      {order && (
        <div className="detail">
          <div className="detail-info">
            <h2>🧾 Order #{order._id.slice(-6).toUpperCase()}</h2>
            <span className={`badge badge-${order.status}`}>{order.status}</span>
            <div style={{ marginTop: "14px" }}>
              <div className="detail-row"><span>Customer</span><span>{order.userName}</span></div>
              <div className="detail-row"><span>Product</span><span>{order.productName}</span></div>
              <div className="detail-row"><span>Quantity</span><span>{order.quantity}</span></div>
              <div className="detail-row"><span>Unit Price</span><span>Rs. {order.totalPrice / order.quantity}</span></div>
              <div className="detail-row"><span>Delivery Address</span><span>{order.address}</span></div>
            </div>
            <div className="total-box">Total: Rs. {order.totalPrice}</div>
            <button className="btn btn-secondary" onClick={() => navigate(`/order/update/${order._id}`)}>Edit Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadSingleOrder;
