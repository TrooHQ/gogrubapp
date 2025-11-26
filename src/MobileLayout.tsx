import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./Mobile/NotFound";
import Login from "./Mobile/authPages/Login";
import RegistrationStepForm from "./Mobile/Components/RegistrationStepForm";
import MenuSetupForm from "./Mobile/Components/MenuSetupForm";
// import ScrollToTop from "./components/ScrollToTop";
import TableSetupForm from "./Mobile/Components/TableSetupForm";
import Dashboard from "./Mobile/authPages/Dashboard";
import Tickets from "./Mobile/Components/Tickets";
import Menu from "./Mobile/Components/Menu";
import Order from "./Mobile/Components/Order";
import Reporting from "./Mobile/Components/Reporting";
import SettingsPage from "./Mobile/SettingsPage";
import ManageQrCode from "./Mobile/Components/Settings/QrCodeSettings/ManageQrCode";
import EnterPassword from "./Mobile/authPages/EnterPassword";
import CreatePassword from "./Mobile/authPages/CreatePassword";
import ListofRestaurants from "./Mobile/Customers/ListofRestaurants";
import StartOrder from "./Mobile/Customers/StartOrder";
// import MenuDetails from "./Mobile/Customers/MenuDetails";
import { MenuPage } from "./Mobile/Customers/MenuPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import { Basket } from "./Mobile/Customers/Basket";
// import { Tip } from "./Mobile/Customers/Tip";
// import { SelectPayment } from "./Mobile/Customers/SelectPayment";
// import { Receipt } from "./Mobile/Customers/Receipt";
// import { GetReceipt } from "./Mobile/Customers/GetReceipt";
import VerifyAccount from "./Mobile/Components/VerifyAccount";
import ForgotPassword from "./Mobile/authPages/ForgotPassword";
import VerifyAccount2 from "./Mobile/Components/VerifyAccount2";
// import { CategoryDetails } from "./Mobile/Customers/CategoryDetails";
import RoomSetupForm from "./Mobile/Components/RoomSetupForm";

// import OnlineOrderingStartOrder from "./Mobile/OnlineOrdering/OnlineOrderingStartOrder";
import { OnlineOrderingMenuPage } from "./Mobile/OnlineOrdering/OnlineOrderingMenuPage";
import OnlineOrderingMenuDetails from "./Mobile/OnlineOrdering/OnlineOrderingMenuDetails";
import { OnlineOrderingBasket } from "./Mobile/OnlineOrdering/OnlineOrderingBasket";
import { OnlineOrderingTip } from "./Mobile/OnlineOrdering/OnlineOrderingTip";
import { OnlineOrderingSelectPayment } from "./Mobile/OnlineOrdering/OnlineOrderingSelectPayment";
import { OnlineOrderingReceipt } from "./Mobile/OnlineOrdering/OnlineOrderingReceipt";
import { OnlineOrderingGetReceipt } from "./Mobile/OnlineOrdering/OnlineOrderingGetReceipt";
import ChooseColor from "./Mobile/Components/Settings/ChooseColor";
import OrderHistory from "./Mobile/Components/OrderHistory";
import AccountVerified from "./Mobile/Components/AccountVerified";
import ItemList from "./CustomerFacing/ItemList";
import ItemDetails from "./CustomerFacing/ItemDetails";
import OrderSummary from "./CustomerFacing/OrderSummary";
import OrderStatus from "./CustomerFacing/OrderStatus";

const MobileLayout = () => {
  return (
    <div className="overflow-hidden font-Inter">
      <ToastContainer />
      <Router>
        {/* <ScrollToTop /> */}
        <Routes>
          <Route path="/digi-input" element={<VerifyAccount2 />} />

          <Route path="/restaurants" element={<ListofRestaurants />} />

          <Route path="/:id?" element={<StartOrder />} />
          <Route
            path="/demo/:id/explore-menu/orderandpay"
            element={<MenuPage />}
          />
          {/* <Route
            path="demo/:id?/category-details/:id?/orderandpay"
            element={<CategoryDetails />}
          /> */}
          {/* <Route
            path="/demo/menu-details/:id/orderandpay"
            element={<MenuDetails />}
          /> */}
          {/* <Route path="/demo/basket/orderandpay" element={<Basket />} />
          <Route path="/demo/tip/orderandpay" element={<Tip />} />
          <Route
            path="/demo/payment-type/orderandpay"
            element={<SelectPayment />}
          />
          <Route path="/demo/receipt/orderandpay" element={<Receipt />} />
          <Route
            path="/demo/get-receipt/orderandpay"
            element={<GetReceipt />}
          /> */}

          <Route
            path="demo/online_ordering/:id/:branchId"
            element={<ItemList />}
          // element={<OnlineOrderingStartOrder />}
          />

          <Route
            path="demo/:id/items/online_ordering"
            element={<ItemList />}
          // element={<OnlineOrderingCategoryDetails />}
          />
          {/*  */}
          <Route
            path="demo/itemlist"
            element={<ItemList />}
          />
          <Route
            path="demo/menudetails"
            element={<ItemDetails />}
          />
          <Route
            path="demo/ordersummary"
            element={<OrderSummary />}
          />
          <Route
            path="demo/order-status"
            element={<OrderStatus />}
          />
          {/*  */}
          <Route
            path="/demo/:id/explore-menu/online_ordering"
            element={<OnlineOrderingMenuPage />}
          />

          <Route
            path="/demo/menu-details/:id/online_ordering"
            element={<OnlineOrderingMenuDetails />}
          />
          <Route
            path="/demo/basket/online_ordering"
            element={<OnlineOrderingBasket />}
          />
          <Route
            path="/demo/tip/online_ordering"
            element={<OnlineOrderingTip />}
          />
          <Route
            path="/demo/payment-type/online_ordering"
            element={<OnlineOrderingSelectPayment />}
          />
          <Route
            path="/demo/receipt/online_ordering/:id?"
            element={<OnlineOrderingReceipt />}
          />
          <Route
            path="/demo/get-receipt/online_ordering"
            element={<OnlineOrderingGetReceipt />}
          />

          <Route
            path="/demo/forgot-password/troo-portal"
            element={<ForgotPassword />}
          />
          <Route path="/demo/dashboard/troo-portal" element={<Dashboard />} />
          <Route path={`/demo/login/troo-portal`} element={<Login />} />

          <Route
            path="/demo/:id/menu-page/:id/troo-portal"
            element={<Menu />}
          />

          <Route path="/demo/ticket/troo-portal" element={<Tickets />} />
          <Route
            path="/demo/order-history/troo-portal"
            element={<OrderHistory />}
          />

          <Route path="/demo/order/troo-portal" element={<Order />} />

          <Route path="/demo/report/troo-portal" element={<Reporting />} />
          <Route
            path="/demo/register/troo-portal?/:id"
            element={<RegistrationStepForm />}
          />
          <Route path="/demo/verify/troo-portal" element={<VerifyAccount />} />
          <Route
            path="/demo/verified/troo-portal"
            element={<AccountVerified />}
          />
          <Route path="/demo/menu/troo-portal" element={<MenuSetupForm />} />
          <Route path="/demo/settings/troo-portal" element={<SettingsPage />} />

          <Route
            path="/demo/password/troo-portal"
            element={<EnterPassword />}
          />
          <Route
            path="/demo/create-password/troo-portal"
            element={<CreatePassword />}
          />
          <Route
            path="/demo/manage-qr/troo-portal"
            element={<ManageQrCode />}
          />

          <Route
            path="/demo/choose-color/troo-portal"
            element={<ChooseColor />}
          />
          <Route path="/demo/table/troo-portal" element={<TableSetupForm />} />
          <Route path="/demo/room/troo-portal" element={<RoomSetupForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default MobileLayout;
