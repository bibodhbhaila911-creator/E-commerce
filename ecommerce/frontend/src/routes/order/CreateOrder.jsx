import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../api";

const CreateOrder = () => {
  let [users, setUsers] = React.useState([]);
  let [products, setProducts] = React.useState([]);
  let [userId, setUserId] = React.useState("");
  let [quantity, setQuantity] = React.useState(1);
  let [address, setAddress] = React.useState("");
  const navigate = useNavigate();

  // if we came from "Order Now", the product id is in the URL: /order/create/:productId
  const params = useParams();
  let [productId, setProductId] = React.useState(params.productId || "");

  // load users and products for the dropdowns
  React.useEffect(() => {
    axios.get(`${API}/user`).then(res => setUsers(res.data.result));
    axios.get(`${API}/product`).then(res => setProducts(res.data.result));
  }, []);

  let selectedUser = users.find((u) => u._id === userId);
  let selectedProduct = products.find((p) => p._id === productId);
  let totalPrice = selectedProduct ? selectedProduct.price * Number(quantity) : 0;

  const handleUserChange = (e) => {
    setUserId(e.target.value);
    let user = users.find((u) => u._id === e.target.value);
    setAddress(user ? user.address : ""); // fill the user's address by default
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check stock before ordering
    if (Number(quantity) > selectedProduct.quantity) {
      toast.error(`Only ${selectedProduct.quantity} ${selectedProduct.name} left in stock`);
      return;
    }

    let data = {
      userName: selectedUser.name,
      productName: selectedProduct.name,
      quantity: Number(quantity),
      totalPrice: totalPrice,
      address: address,
    };

    try {
      // 1. create the order
      await axios.post(`${API}/order`, data);

      // 2. reduce the product stock (update product)
      await axios.patch(`${API}/product/${selectedProduct._id}`, {
        quantity: selectedProduct.quantity - Number(quantity),
      });

      toast.success(`Order for ${selectedProduct.name} Placed Successfully`);
      navigate("/order");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data.message || "Failed to place order");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Place Order</h2>
      <div className="form-group">
        <label>Customer</label>
        <select value={userId} onChange={handleUserChange} required>
          <option value="">-- Select User --</option>
          {users.map((value, i) => (
            <option key={i} value={value._id}>{value.name} ({value.email})</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Product</label>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
          <option value="">-- Select Product --</option>
          {products.filter((p) => p.quantity > 0).map((value, i) => (
            <option key={i} value={value._id}>{value.name} - Rs. {value.price} ({value.quantity} left)</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Quantity</label>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Delivery Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="total-box">Total: Rs. {totalPrice}</div>
      <button className="btn btn-primary" type="submit">Place Order</button>
    </form>
  );
};

export default CreateOrder;
