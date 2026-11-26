import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const CreateCategory = () => {
  let [name, setName] = React.useState("");
  let [description, setDescription] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name: name,
      description: description,
    };

    try {
      await axios.post(`${API}/category`, data);
      toast.success(`Category ${name} Created Successfully`);
      navigate("/category");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to create category");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add Category</h2>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit">Add Category</button>
    </form>
  );
};

export default CreateCategory;
