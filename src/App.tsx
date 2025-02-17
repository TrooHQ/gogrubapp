import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.tsx";
import LoginPage from "./pages/LoginPage.js";
import NotFound from "./components/NotFound.tsx";
import CheckMail from "./components/authPages/CheckMail.tsx";
import ForgotPassword from "./components/authPages/ForgotPassword.tsx";
import ResetPassword from "./components/authPages/ResetPassword.tsx";
import PasswordChanged from "./components/authPages/PasswordChanged.tsx";
import BusinessProfiles from "./components/authPages/BusinessProfiles.tsx";
import Register from "./components/authPages/Register.tsx";
import VerifyAccount from "./components/authPages/VerifyAccount.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import ManageUsers from "./components/Dashboard/ManageUsers.tsx";
import Overview from "./components/Dashboard/Overview.tsx";
import Roles from "./components/Dashboard/Roles.tsx";
import NewRoles from "./components/Dashboard/NewRoles.tsx";
import MenuBuilder from "./components/Dashboard/MenuBuilder.tsx";
import PriceList from "./components/Dashboard/PriceList.tsx";
import ManageTables from "./components/Dashboard/ManageTables.tsx";
import TableList from "./components/Dashboard/TableList.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Tickets from "./components/Dashboard/Tickets.tsx";
import OverviewAdmin from "./components/Dashboard/OverviewAdmin.tsx";
import TenantSettings from "./components/Dashboard/TenantSettings.tsx";
import MenuList from "./components/Dashboard/MenuList.tsx";
import OrderHistory from "./components/Dashboard/OrderHistory.tsx";
import CreatePin from "./components/authPages/CreatePin.tsx";
import PinCreated from "./components/authPages/PinCreated.tsx";
import UpdateCredentials from "./components/authPages/UpdateCredentials.tsx";

export default function App() {
  return (
    <div className=" font-GeneralSans">
      <Router>
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/tenant-settings" element={<TenantSettings />} />
          <Route path="/manage-assets" element={<ManageTables />} />
          <Route path="/table-list" element={<TableList />} />
          <Route path="/menu-builder" element={<MenuBuilder />} />
          <Route path="/menu-list" element={<MenuList />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/overview-admin" element={<OverviewAdmin />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/new-roles" element={<NewRoles />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-profile" element={<BusinessProfiles />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/checkmail" element={<CheckMail />} />
          <Route path="/password-changed" element={<PasswordChanged />} />
          <Route path="/pin-created" element={<PinCreated />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/update-credentials" element={<UpdateCredentials />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
