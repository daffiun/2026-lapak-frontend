import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Search, User, DoorOpen, Edit3, X } from "lucide-react";

const API_BASE = "http://localhost:5298/api/booking";
const API_ROOM = "http://localhost:5298/api/room";

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    borrowerName: "",
    borrowerNrp: "",
    roomId: 0,
    startDate: "",
    endDate: "",
    operatorName: "Admin"
  });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}?search=${search}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_ROOM);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (booking: any = null) => {
    if (booking) {
      setEditId(booking.id);
      setFormData({
        borrowerName: booking.borrowerName,
        borrowerNrp: booking.borrowerNrp,
        roomId: booking.roomId,
        startDate: new Date(booking.startDate).toISOString().slice(0, 16),
        endDate: new Date(booking.endDate).toISOString().slice(0, 16),
        operatorName: booking.operatorName || "Admin"
      });
    } else {
      setEditId(null);
      setFormData({
        borrowerName: "",
        borrowerNrp: "",
        roomId: 0,
        startDate: "",
        endDate: "",
        operatorName: "Admin"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.roomId === 0) {
      alert("Silakan pilih ruangan!");
      return;
    }

    const payload = {
      ...formData,
      id: editId || 0,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      if (editId) {
        await axios.put(`${API_BASE}/${editId}`, payload);
        alert("Booking berhasil diperbarui!");
      } else {
        await axios.post(API_BASE, payload);
        alert("Booking berhasil disimpan!");
      }
      setIsModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      alert("Gagal memproses data");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`${API_BASE}/${id}/status`, `"${status}"`, {
        headers: { "Content-Type": "application/json" }
      });
      fetchBookings();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchBookings();
      } catch (err) {
        alert("Gagal menghapus data");
      }
    }
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Peminjaman</h1>
          <p className="text-sm text-gray-500">Kelola dan pantau status peminjaman ruangan.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Plus size={20} /> Booking Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama peminjam atau NRP..." 
          className="w-full outline-none text-gray-600 bg-transparent"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchBookings()}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-orange-50/50 text-orange-800 text-xs uppercase font-bold">
              <tr>
                <th className="p-5">Peminjam</th>
                <th className="p-5">Ruangan & Kode</th>
                <th className="p-5">Waktu Peminjaman</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length > 0 ? bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{b.borrowerName}</div>
                        <div className="text-xs text-gray-400">{b.borrowerNrp}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-gray-800 font-semibold">
                        <DoorOpen size={16} className="text-orange-400" />
                        <span>{b.room?.name || "N/A"}</span>
                      </div>
                      <span className="text-xs text-orange-500 font-bold ml-6 bg-orange-50 px-2 py-0.5 rounded w-max tracking-wider uppercase">
                        {b.room?.roomNumber || "No Code"}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-gray-500">
                    <div className="flex flex-col text-xs space-y-1">
                      <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">Mulai: {new Date(b.startDate).toLocaleString('id-ID')}</span>
                      <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">Selesai: {new Date(b.endDate).toLocaleString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <select 
                      value={b.status} 
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-none outline-none appearance-none cursor-pointer ${
                        b.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <option value="Pending">🕒 Pending</option>
                      <option value="Approved">✅ Approved</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => openModal(b)} 
                        className="text-blue-500 hover:text-blue-700 transition-colors p-2 bg-blue-50 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)} 
                        className="text-red-500 hover:text-red-700 transition-colors p-2 bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400 italic font-medium">Data peminjaman tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{editId ? "Edit Peminjaman" : "Booking Baru"}</h2>
                <p className="text-orange-100 text-xs font-medium">Lengkapi rincian jadwal peminjaman.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-orange-600 p-2 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Nama Peminjam</label>
                      <input 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition"
                        value={formData.borrowerName}
                        onChange={e => setFormData({...formData, borrowerName: e.target.value})}
                        required 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">NRP / ID</label>
                      <input 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition"
                        value={formData.borrowerNrp}
                        onChange={e => setFormData({...formData, borrowerNrp: e.target.value})}
                        required 
                      />
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Ruangan</label>
                  <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition cursor-pointer"
                    value={formData.roomId}
                    onChange={e => setFormData({...formData, roomId: Number(e.target.value)})}
                    required
                  >
                    <option value={0}>Pilih Ruangan</option>
                    {rooms.map((r: any) => (
                      <option key={r.id} value={r.id}>
                        [{r.roomNumber}] - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Mulai</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Selesai</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-6">
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95"
                >
                  {editId ? "Simpan Perubahan" : "Konfirmasi Booking"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;