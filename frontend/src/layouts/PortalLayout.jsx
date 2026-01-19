import PortalNavbar from "../components/PortalNavbar";
import { Outlet } from "react-router-dom";

export default function PortalLayout() {
  return (
    <>
      <PortalNavbar />
      <main className="bg-gray-50 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </>
  );
}
