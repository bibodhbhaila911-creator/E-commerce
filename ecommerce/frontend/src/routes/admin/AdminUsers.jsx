import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    axios.get(`${API}/user`).then(res => setUsers(res.data.result));
    axios.get(`${API}/order`).then(res => setOrders(res.data.result));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}?`)) return;
    try {
      await axios.delete(`${API}/user/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success(`User ${name} Deleted Successfully`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to delete user");
    }
  };

  // orders only store the customer name, so match users by name
  const ordersOf = (name) => orders.filter((o) => o.userName === name);

  let shownUsers = users.filter((u) =>
    (u.name + " " + u.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2>Manage Users</h2>
        <button className="btn btn-primary" onClick={() => navigate("/user/create")}>+ Add User</button>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {shownUsers.length === 0 && <p className="empty">No users found.</p>}
      {shownUsers.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shownUsers.map((u) => {
                let userOrders = ordersOf(u.name);
                let spent = userOrders
                  .filter((o) => o.status !== "Cancelled")
                  .reduce((sum, o) => sum + o.totalPrice, 0);
                return (
                  <tr key={u._id}>
                    <td><b>{u.name}</b></td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{userOrders.length}</td>
                    <td>Rs. {spent}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-secondary" onClick={() => navigate(`/user/update/${u._id}`)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(u._id, u.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
