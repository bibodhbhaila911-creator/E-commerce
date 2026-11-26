import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const UpdateCategory = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/category/${id}`)
      .then(res => {
        const c = res.data.result;
        setName(c.name);
        setDescription(c.description || "");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/category/${id}`, { name, description });
      toast.success(`Category ${name} Updated Successfully`);
      navigate("/category");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update category");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Edit Category</h2>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
};

export default UpdateCategory;
