import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";

import CreateProduct from "./routes/product/CreateProduct";
import ReadallProduct from "./routes/product/ReadallProduct";
import ReadSingleProduct from "./routes/product/ReadSingleProduct";
import UpdateProduct from "./routes/product/UpdateProduct";

import CreateCategory from "./routes/category/CreateCategory";
import ReadallCategory from "./routes/category/ReadallCategory";
import ReadSingleCategory from "./routes/category/ReadSingleCategory";
import UpdateCategory from "./routes/category/UpdateCategory";

import CreateUser from "./routes/user/CreateUser";
import ReadallUser from "./routes/user/ReadallUser";
import ReadSingleUser from "./routes/user/ReadSingleUser";
import UpdateUser from "./routes/user/UpdateUser";

import CreateOrder from "./routes/order/CreateOrder";
import ReadallOrder from "./routes/order/ReadallOrder";
import ReadSingleOrder from "./routes/order/ReadSingleOrder";
import UpdateOrder from "./routes/order/UpdateOrder";

import AdminLayout from "./routes/admin/AdminLayout";
import AdminDashboard from "./routes/admin/AdminDashboard";
import AdminOrders from "./routes/admin/AdminOrders";
import AdminProducts from "./routes/admin/AdminProducts";
import AdminUsers from "./routes/admin/AdminUsers";
const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/update/:id" element={<UpdateProduct />} />
        <Route path="/product/:id" element={<ReadSingleProduct />} />
        <Route path="/product" element={<ReadallProduct />} />

        <Route path="/category/create" element={<CreateCategory />} />
        <Route path="/category/update/:id" element={<UpdateCategory />} />
        <Route path="/category/:id" element={<ReadSingleCategory />} />
        <Route path="/category" element={<ReadallCategory />} />

        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/user/update/:id" element={<UpdateUser />} />
        <Route path="/user/:id" element={<ReadSingleUser />} />
        <Route path="/user" element={<ReadallUser />} />

        <Route path="/order/create" element={<CreateOrder />} />
        <Route path="/order/create/:productId" element={<CreateOrder />} />
        <Route path="/order/update/:id" element={<UpdateOrder />} />
        <Route path="/order/:id" element={<ReadSingleOrder />} />
        <Route path="/order" element={<ReadallOrder />} />

        {/* admin panel: nested routes render inside AdminLayout's <Outlet /> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
