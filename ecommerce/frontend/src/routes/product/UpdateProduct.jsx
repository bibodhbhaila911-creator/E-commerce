import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const UpdateProduct = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [image, setImage] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // load categories + the product's current values into the form
  React.useEffect(() => {
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));

    axios.get(`${API}/product/${id}`)
      .then(res => {
        const p = res.data.result;
        setName(p.name);
        setDescription(p.description || "");
        setPrice(p.price);
        setQuantity(p.quantity);
        setCategory(p.category);
        setImage(p.image || "");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API}/product/${id}`, {
        name, description, price: Number(price), quantity: Number(quantity), category, image
      });
      toast.success(`Product ${name} Updated Successfully`);
      navigate("/product");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update product");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
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
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
};

export default UpdateProduct;
