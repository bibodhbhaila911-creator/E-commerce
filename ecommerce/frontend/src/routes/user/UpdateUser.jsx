import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const UpdateUser = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/user/${id}`)
      .then(res => {
        const u = res.data.result;
        setName(u.name);
        setEmail(u.email);
        setPassword(u.password);
        setAddress(u.address);
        setPhone(u.phone);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/user/${id}`, {
        name, email, password, address, phone
      });
      toast.success(`User ${name} Updated Successfully`);
      navigate("/user");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update user");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Edit User</h2>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
};

export default UpdateUser;
