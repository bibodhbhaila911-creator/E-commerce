import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
  }, []);

  // quickly add stock without opening the edit page
  const handleRestock = async (product) => {
    let amount = Number(window.prompt(`How many ${product.name} to add?`, "10"));
    if (!amount || amount <= 0) return;
    let quantity = product.quantity + amount;
    try {
      await axios.patch(`${API}/product/${product._id}`, { quantity });
      setProducts(products.map((p) => (p._id === product._id ? { ...p, quantity } : p)));
      toast.success(`${product.name} stock is now ${quantity}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to update stock");
    }
  };

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

  let shownProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h2>Manage Products</h2>
        <button className="btn btn-primary" onClick={() => navigate("/product/create")}>+ Add Product</button>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {shownProducts.length === 0 && <p className="empty">No products found.</p>}
      {shownProducts.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shownProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.image ? <img src={p.image} alt={p.name} className="thumb" /> : "📦"}</td>
                  <td><b>{p.name}</b></td>
                  <td><span className="badge">{p.category}</span></td>
                  <td>Rs. {p.price}</td>
                  <td className={p.quantity < 5 ? "stock-low" : ""}>{p.quantity}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-success" onClick={() => handleRestock(p)}>+ Stock</button>
                      <button className="btn btn-secondary" onClick={() => navigate(`/product/update/${p._id}`)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
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

export default AdminProducts;
