
import { Outlet } from "react-router-dom";
import AdminTopbar from "./AdminTopbr";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;