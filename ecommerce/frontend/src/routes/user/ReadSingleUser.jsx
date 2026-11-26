import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api";

const ReadSingleUser = () => {
  const [user, setUser] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/user/${id}`)
      .then(res => {
        setUser(res.data.result);
        // show this user's orders
        axios.get(`${API}/order`)
          .then(res2 => setOrders(res2.data.result.filter((o) => o.userName === res.data.result.name)));
      });
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h2>User Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/user")}>← Back</button>
      </div>
      {user && (
        <div>
          <div className="detail" style={{ marginBottom: "24px" }}>
            <div className="detail-info">
              <h2>👤 {user.name}</h2>
              <div className="detail-row"><span>Email</span><span>{user.email}</span></div>
              <div className="detail-row"><span>Phone</span><span>{user.phone}</span></div>
              <div className="detail-row"><span>Address</span><span>{user.address}</span></div>
              <div className="detail-row"><span>Total Orders</span><span>{orders.length}</span></div>
              <div className="actions">
                <button className="btn btn-secondary" onClick={() => navigate(`/user/update/${user._id}`)}>Edit</button>
              </div>
            </div>
          </div>

          <h3 style={{ marginBottom: "14px" }}>Orders by {user.name}</h3>
          {orders.length === 0 && <p className="empty">This user has no orders yet.</p>}
          {orders.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.map((value, i) => (
                    <tr key={i}>
                      <td>{value.productName}</td>
                      <td>{value.quantity}</td>
                      <td>Rs. {value.totalPrice}</td>
                      <td><span className={`badge badge-${value.status}`}>{value.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadSingleUser;
