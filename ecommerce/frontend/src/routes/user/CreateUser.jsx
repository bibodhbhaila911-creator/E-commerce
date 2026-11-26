import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const CreateUser = () => {
  let [name, setName] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [address, setAddress] = React.useState("");
  let [phone, setPhone] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name: name,
      email: email,
      password: password,
      address: address,
      phone: phone,
    };

    try {
      await axios.post(`${API}/user`, data);
      toast.success(`User ${name} Created Successfully`);
      navigate("/user");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to create user");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add User</h2>
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
      <button className="btn btn-primary" type="submit">Add User</button>
    </form>
  );
};

export default CreateUser;
