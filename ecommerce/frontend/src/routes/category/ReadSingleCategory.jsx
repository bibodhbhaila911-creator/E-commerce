import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api";

const ReadSingleCategory = () => {
  const [category, setCategory] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get(`${API}/category/${id}`)
      .then(res => {
        setCategory(res.data.result);
        // show the products that belong to this category
        axios.get(`${API}/product`)
          .then(res2 => setProducts(res2.data.result.filter((p) => p.category === res.data.result.name)));
      });
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h2>Category Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/category")}>← Back</button>
      </div>
      {category && (
        <div>
          <div className="detail" style={{ marginBottom: "24px" }}>
            <div className="detail-info">
              <h2>📁 {category.name}</h2>
              <p style={{ color: "#6b7280" }}>{category.description || "No description"}</p>
              <div className="detail-row"><span>Total Products</span><span>{products.length}</span></div>
            </div>
          </div>

          <h3 style={{ marginBottom: "14px" }}>Products in {category.name}</h3>
          {products.length === 0 && <p className="empty">No products in this category.</p>}
          <div className="grid">
            {products.map((value, i) => (
              <div key={i} className="card">
                {value.image
                  ? <img src={value.image} alt={value.name} className="product-img" />
                  : <div className="no-img">📦</div>}
                <h3>{value.name}</h3>
                <p className="price">Rs. {value.price}</p>
                <button className="btn btn-secondary" onClick={() => navigate(`/product/${value._id}`)}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadSingleCategory;
