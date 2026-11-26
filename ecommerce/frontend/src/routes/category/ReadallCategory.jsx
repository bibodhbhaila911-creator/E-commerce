import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const ReadallCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category ${name}?`)) return;
    try {
      await axios.delete(`${API}/category/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success(`Category ${name} Deleted Successfully`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to delete category");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Categories</h2>
        <button className="btn btn-primary" onClick={() => navigate("/category/create")}>+ Add Category</button>
      </div>
      {categories.length === 0 && <p className="empty">No categories found.</p>}
      <div className="grid">
        {categories.map((value, i) => (
          <div key={i} className="card">
            <h3>📁 {value.name}</h3>
            <p>{value.description || "No description"}</p>
            <span className="badge">
              {products.filter((p) => p.category === value.name).length} products
            </span>
            <div className="actions">
              <button className="btn btn-secondary" onClick={() => navigate(`/category/${value._id}`)}>View</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/category/update/${value._id}`)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(value._id, value.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadallCategory;
