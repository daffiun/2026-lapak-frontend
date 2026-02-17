import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import RoomList from "./pages/RoomList";
import BookingPage from "./pages/BookingPage";
import BuildingList from "./pages/BuildingList";
import Dashboard from "./pages/DashboardPage";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  DoorOpen, 
  Building2, 
  Menu, 
  X 
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label, active }: any) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
        : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
    }`}
  >
    <Icon size={20} />
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

const SidebarContent = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-orange-500 p-2 rounded-lg text-white">
          <Building2 size={24} />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">LA<span className="text-orange-500">PAK</span></h1>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} />
        <NavItem to="/Booking" icon={CalendarCheck} label="Peminjaman" active={location.pathname === "/Booking"} />
        <NavItem to="/Room" icon={DoorOpen} label="Ruangan" active={location.pathname === "/Room"} />
        <NavItem to="/Building" icon={Building2} label="Gedung" active={location.pathname === "/Building"} />
      </nav>

      <div className="mt-auto p-4 bg-orange-50 rounded-2xl">
        <p className="text-xs text-orange-700 font-bold mb-1">Admin Panel</p>
        <p className="text-[10px] text-orange-600/70 leading-relaxed">Layanan Administrasi Peminjaman Akses Kampus</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
        
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-100 shadow-sm sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800">Room<span className="text-orange-500">Ease</span></h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50">
            <aside className="w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-300">
              <div className="flex justify-end p-4">
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>
              <SidebarContent />
            </aside>
          </div>
        )}

        <main className="flex-1 w-full lg:max-w-none pt-16 lg:pt-0 overflow-x-hidden">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Booking" element={<BookingPage />} />
              <Route path="/Room" element={<RoomList />} />
              <Route path="/Building" element={<BuildingList />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;