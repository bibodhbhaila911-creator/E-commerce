import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const ReadallUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${API}/user`).then(res => setUsers(res.data.result));
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

  return (
    <div>
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => navigate("/user/create")}>+ Add User</button>
      </div>
      {users.length === 0 && <p className="empty">No users found.</p>}
      {users.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((value, i) => (
                <tr key={i}>
                  <td><b>{value.name}</b></td>
                  <td>{value.email}</td>
                  <td>{value.phone}</td>
                  <td>{value.address}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => navigate(`/user/${value._id}`)}>View</button>
                      <button className="btn btn-secondary" onClick={() => navigate(`/user/update/${value._id}`)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(value._id, value.name)}>Delete</button>
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

export default ReadallUser;
