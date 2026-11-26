import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const ReadallProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("");

  React.useEffect(() => {
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
    axios.get(`${API}/category`).then(res => setCategories(res.data.result));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await axios.delete(`${API}/product/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success(`Product ${name} Deleted Successfully`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to delete product");
    }
  };

  // search by name and filter by category (done in the frontend)
  let shownProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "" || p.category === filterCategory)
  );

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => navigate("/product/create")}>+ Add Product</button>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((value, i) => (
            <option key={i} value={value.name}>{value.name}</option>
          ))}
        </select>
      </div>

      {shownProducts.length === 0 && <p className="empty">No products found.</p>}

      <div className="grid">
        {shownProducts.map((value, i) => (
          <div key={i} className="card">
            {value.image
              ? <img src={value.image} alt={value.name} className="product-img" />
              : <div className="no-img">📦</div>}
            <span className="badge">{value.category}</span>
            <h3 style={{ marginTop: "8px" }}>{value.name}</h3>
            <p className="price">Rs. {value.price}</p>
            <p className={value.quantity < 5 ? "stock-low" : ""}>
              {value.quantity === 0 ? "Out of stock" : `In stock: ${value.quantity}`}
            </p>
            <div className="actions">
              <button className="btn btn-primary" disabled={value.quantity === 0} onClick={() => navigate(`/order/create/${value._id}`)}>Order Now</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/product/${value._id}`)}>View</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/product/update/${value._id}`)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(value._id, value.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadallProduct;
