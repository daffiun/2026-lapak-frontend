import React, { useState, useEffect } from "react";
import axios from "axios";
import { Building2, DoorOpen, CalendarCheck, AlertCircle, Clock } from "lucide-react";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ bookings: 0, rooms: 0, buildings: 0 });
  const [occupancyToday, setOccupancyToday] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [b, r, bld] = await Promise.all([
          axios.get("http://localhost:5298/api/booking"),
          axios.get("http://localhost:5298/api/room"),
          axios.get("http://localhost:5298/api/building")
        ]);
        
        const todayStr = new Date().toLocaleDateString('en-CA'); 

        const bookingsToday = b.data.filter((booking: any) => {
          const start = new Date(booking.startDate).toLocaleDateString('en-CA');
          const end = new Date(booking.endDate).toLocaleDateString('en-CA');
          return todayStr >= start && todayStr <= end;
        });

        setStats({ 
          bookings: b.data.length, 
          rooms: r.data.length, 
          buildings: bld.data.length 
        });

        setOccupancyToday(bookingsToday.length);
        setRecentBookings(b.data.slice(-5).reverse());
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const Card = ({ title, count, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={20} />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-gray-800">{loading ? "..." : count}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Ringkasan Sistem</h1>
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-bold animate-pulse">
            <AlertCircle size={16} /> API Terputus
          </div>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Booking" count={stats.bookings} icon={CalendarCheck} color="bg-orange-500" />
        <Card title="Ruangan" count={stats.rooms} icon={DoorOpen} color="bg-orange-400" />
        <Card title="Gedung" count={stats.buildings} icon={Building2} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-orange-500" /> Aktivitas Terbaru
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Peminjam</th>
                  <th className="px-5 py-3">Ruangan</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.length > 0 ? recentBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-3 font-medium text-gray-700">{b.borrowerName}</td>
                    <td className="px-5 py-3 text-gray-500">{b.room?.name || "N/A"}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-gray-400 italic text-xs">Tidak ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center space-y-4">
          <h3 className="font-bold text-gray-800 text-sm text-center">Okupansi Hari Ini</h3>
          <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={314} 
                        strokeDashoffset={314 - (314 * (stats.rooms > 0 ? (occupancyToday / stats.rooms) : 0))}
                        className="text-orange-500" strokeLinecap="round" />
             </svg>
             <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-gray-800">
                  {stats.rooms > 0 ? Math.round((occupancyToday / stats.rooms) * 100) : 0}%
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Terisi</span>
             </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-orange-600 bg-orange-50 py-1 px-3 rounded-full inline-block">
              {occupancyToday} / {stats.rooms} Ruangan Aktif
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;