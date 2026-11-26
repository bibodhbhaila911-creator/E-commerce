import React from "react";
import { NavLink, Outlet } from "react-router-dom";

// sidebar on the left, the selected admin page shows on the right (<Outlet />)
const AdminLayout = () => {
  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <h3>⚙️ Admin Panel</h3>
        <NavLink to="/admin" end>📊 Dashboard</NavLink>
        <NavLink to="/admin/orders">🧾 Orders</NavLink>
        <NavLink to="/admin/products">📦 Products</NavLink>
        <NavLink to="/admin/users">👤 Users</NavLink>
        <NavLink to="/category">📁 Categories</NavLink>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
