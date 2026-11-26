import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api";

const ReadSingleProduct = () => {
  const [product, setProduct] = React.useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/product/${id}`)
      .then(res => setProduct(res.data.result));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h2>Product Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/product")}>← Back</button>
      </div>
      {product && (
        <div className="detail">
          {product.image
            ? <img src={product.image} alt={product.name} className="detail-img" />
            : <div className="no-img detail-img">📦</div>}
          <div className="detail-info">
            <span className="badge">{product.category}</span>
            <h2 style={{ marginTop: "10px" }}>{product.name}</h2>
            <p style={{ color: "#6b7280", marginBottom: "10px" }}>{product.description || "No description"}</p>
            <p className="price">Rs. {product.price}</p>
            <div className="detail-row"><span>Category</span><span>{product.category}</span></div>
            <div className="detail-row"><span>In Stock</span><span>{product.quantity}</span></div>
            <div className="actions">
              <button className="btn btn-primary" disabled={product.quantity === 0} onClick={() => navigate(`/order/create/${product._id}`)}>Order Now</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/product/update/${product._id}`)}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadSingleProduct;
