import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import UserRoute from "./Modules/user/routes/UserRoute";
import ExpertRoute from "./Modules/expert/Route/ExpertRoute";
import DeliveryRoute from "./Modules/worker/Route/DeliveryRoute";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/admin/*" element={<AdminRoute />}/>
          <Route exact path="/*" element={<UserRoute />}/>
          <Route exact path="/expert/*" element={<ExpertRoute />} />
          <Route exact path="/delivery/*" element={<DeliveryRoute />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
