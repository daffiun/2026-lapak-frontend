import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, MapPin, DoorOpen, User } from "lucide-react";

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    roomNumber: "", 
    buildingId: 0, 
    description: "", 
    headOfRoom: "" 
  });

  const API_ROOM = "http://localhost:5298/api/Room";
  const API_BUILDING = "http://localhost:5298/api/Building";

  useEffect(() => { 
    fetchRooms(); 
    fetchBuildings(); 
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_ROOM);
      setRooms(res.data);
    } catch (err) {
      console.error("Gagal mengambil data ruangan:", err);
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(API_BUILDING);
      setBuildings(res.data);
    } catch (err) {
      console.error("Gagal mengambil data gedung:", err);
    }
  };

  const handleOpenModal = (room?: any) => {
    if (room) {
      setEditId(room.id);
      setForm({ 
        name: room.name, 
        roomNumber: room.roomNumber, 
        buildingId: room.buildingId, 
        description: room.description || "", 
        headOfRoom: room.headOfRoom 
      });
    } else {
      setEditId(null);
      setForm({ name: "", roomNumber: "", buildingId: 0, description: "", headOfRoom: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.buildingId === 0) {
      alert("Silakan pilih gedung terlebih dahulu!");
      return;
    }

    try {
      if (editId) {
        // Update data (Sertakan ID dalam body jika API memerlukannya)
        await axios.put(`${API_ROOM}/${editId}`, { id: editId, ...form });
        alert("Ruangan berhasil diperbarui!");
      } else {
        // Simpan data baru
        await axios.post(API_ROOM, form);
        alert("Ruangan berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (err: any) {
      console.error("Error Detail:", err.response?.data);
      alert(err.response?.data?.title || "Terjadi kesalahan saat menyimpan ruangan.");
    }
  };

  const handleDelete = async (id: number) => {
    // Perbaikan ESLint: window.confirm
    if (window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) {
      try {
        await axios.delete(`${API_ROOM}/${id}`);
        fetchRooms();
      } catch (err) {
        alert("Gagal menghapus ruangan. Ruangan mungkin sedang digunakan dalam data peminjaman.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengelolaan Ruangan</h1>
          <p className="text-gray-500 text-sm">Pilih dan atur ruangan berdasarkan gedung.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-all flex items-center gap-2"
        >
          <DoorOpen size={18} /> Tambah Ruang
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-orange-50/50">
              <tr className="text-orange-800 text-xs uppercase font-black">
                <th className="p-5">Ruangan</th>
                <th className="p-5">Gedung</th>
                <th className="p-5">PJ Ruang</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rooms.map((r: any) => (
                <tr key={r.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-gray-800">{r.name}</div>
                    <div className="text-xs text-orange-500 font-medium tracking-wider">NO: {r.roomNumber}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <MapPin size={14} className="text-orange-400" />
                      {r.building?.name || "Gedung Tidak Diketahui"}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={14} className="text-gray-400" />
                      {r.headOfRoom}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenModal(r)} 
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-lg transition-all"
                        title="Edit Ruangan"
                      >
                        <Edit2 size={18}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus Ruangan"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 italic">Data ruangan belum tersedia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ROOM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
            <div className="bg-orange-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">{editId ? "Edit Ruangan" : "Tambah Ruangan"}</h2>
              <p className="text-orange-100 text-xs">Pastikan nomor ruangan unik dan gedung sudah benar.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 ml-1">Nama Ruangan</label>
                  <input 
                    placeholder="Contoh: Lab Komputer" 
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-orange-400 transition-all" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 ml-1">Nomor Ruang</label>
                  <input 
                    placeholder="Contoh: A.1.02" 
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-orange-400 transition-all" 
                    value={form.roomNumber} 
                    onChange={e => setForm({...form, roomNumber: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 ml-1">Gedung Lokasi</label>
                <select 
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-orange-400 transition-all cursor-pointer" 
                  value={form.buildingId} 
                  onChange={e => setForm({...form, buildingId: Number(e.target.value)})} 
                  required
                >
                  <option value={0}>-- Pilih Gedung --</option>
                  {buildings.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 ml-1">Penanggung Jawab (PJ)</label>
                <input 
                  placeholder="Nama Kepala Ruangan" 
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-orange-400 transition-all" 
                  value={form.headOfRoom} 
                  onChange={e => setForm({...form, headOfRoom: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 ml-1">Deskripsi Ruangan</label>
                <textarea 
                  placeholder="Fasilitas atau kapasitas ruangan..." 
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-orange-400 transition-all h-24 resize-none" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95"
                >
                  {editId ? "Simpan Perubahan" : "Simpan Ruangan"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3.5 text-gray-500 font-medium hover:bg-gray-100 rounded-2xl transition-colors"
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

export default RoomPage;