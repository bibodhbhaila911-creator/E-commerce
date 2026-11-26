import React from "react";
import Navigation from "./Navigation";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div>
      <Navigation />
      <div className="container">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
