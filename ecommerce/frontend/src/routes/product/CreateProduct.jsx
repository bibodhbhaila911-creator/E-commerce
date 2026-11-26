import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const CreateProduct = () => {
  let [name, setName] = React.useState("");
  let [description, setDescription] = React.useState("");
  let [price, setPrice] = React.useState("");
  let [quantity, setQuantity] = React.useState("");
  let [category, setCategory] = React.useState("");
  let [image, setImage] = React.useState("");
  let [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  // load categories for the dropdown
  React.useEffect(() => {
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      name: name,
      description: description,
      price: Number(price),
      quantity: Number(quantity),
      category: category,
      image: image,
    };

    try {
      await axios.post(`${API}/product`, data);
      toast.success(`Product ${name} Created Successfully`);
      navigate("/product");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to create product");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      {categories.length === 0 && <p className="stock-low" style={{ marginBottom: "14px" }}>Create a category first.</p>}
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Price (Rs.)</label>
        <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">-- Select Category --</option>
          {categories.map((value, i) => (
            <option key={i} value={value.name}>{value.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Image URL (optional)</label>
        <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit">Add Product</button>
    </form>
  );
};

export default CreateProduct;
