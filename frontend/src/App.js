import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/features/authSlice";
import Login from "./views/Login";
import Register from "./views/Register";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTable from "./components/UserTable";
import UserMangement from "./components/UserMangement";
import Categories from "./components/Categories";
import Frais from "./components/Frais";
import UserProfil from "./components/UserProfil";
import Password from "./views/Password";
import Paiments from "./components/Paiments";
import Depenses from "./components/Depenses";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import PaidIcon from "@mui/icons-material/Paid";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ResetPassword from "./views/ResetPassword";
const role = localStorage.getItem("role");
export const routes = [
  role !== "resident" && {
    type: "item",
    name: "Table",
    key: "Tables",
    route: "/dashboard",
    component: <UserTable />,
    icon: <BackupTableIcon />,
  },
  {
    type: "item",
    name: "Table",
    key: "User profile",
    route: "/dashboard/profile",
    component: <UserProfil />,
    icon: <PersonIcon />,
  },
  role !== "resident" && {
    type: "item",
    name: "Table",
    key: "User management",
    route: "/dashboard/table",
    component: <UserMangement />,
    icon: <GroupIcon />,
  },
  {
    type: "item",
    name: "Categories",
    key: "Category",
    route: "/dashboard/Categories",
    component: <Categories />,
    icon: <CategoryIcon />,
  },
  {
    type: "item",
    name: "Frais",
    key: "Costs",
    route: "/dashboard/Frais",
    component: <Frais />,
    icon: <PaidIcon />,
  },
  {
    type: "item",
    name: "Paiments",
    key: "Payment",
    route: "/dashboard/Paiments",
    component: <Paiments />,
    icon: <PointOfSaleIcon />,
  },
  {
    type: "item",
    name: "Dépenses",
    key: "Spent",
    route: "/dashboard/Dépenses",
    component: <Depenses />,
    icon: <PriceCheckIcon />,
  },
].filter((route) => route);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const profileData = localStorage.getItem("token");
    if (profileData) {
      dispatch(loadUser());
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {routes.map((prop, key) => (
            <Route
              key={prop.key}
              path={prop.route}
              element={<ProtectedRoute>{prop.component}</ProtectedRoute>}
            />
          ))}
          <Route
            path="*"
            element={
              role !== "resident" ? (
                <ProtectedRoute>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              ) : (
                <ProtectedRoute>
                  <Navigate to="/dashboard/Paiments" />
                </ProtectedRoute>
              )
            }
          />
          <Route path="/confirmPassword/:email" element={<ResetPassword />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgetPassword" element={<Password />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
