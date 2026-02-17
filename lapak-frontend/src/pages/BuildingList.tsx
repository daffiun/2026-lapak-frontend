import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus, MapPin, User as UserIcon } from "lucide-react";

const BuildingPage: React.FC = () => {
  const [buildings, setBuildings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    operatorName: "", 
    address: "" 
  });

  const API_URL = "http://localhost:5298/api/Building";

  useEffect(() => { 
    fetchBuildings(); 
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBuildings(res.data);
    } catch (err) {
      console.error("Gagal mengambil data gedung:", err);
    }
  };

  const handleOpenModal = (building?: any) => {
    if (building) {
      setEditId(building.id);
      setForm({ 
        name: building.name, 
        description: building.description || "", 
        operatorName: building.operatorName, 
        address: building.address 
      });
    } else {
      setEditId(null);
      setForm({ name: "", description: "", operatorName: "", address: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { id: editId, ...form });
        alert("Gedung berhasil diperbarui!");
      } else {
        await axios.post(API_URL, form);
        alert("Gedung baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      setForm({ name: "", description: "", operatorName: "", address: "" });
      fetchBuildings();
    } catch (err: any) {
      alert(err.response?.data?.title || "Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus gedung ini? Semua ruangan di dalamnya mungkin akan terpengaruh.")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBuildings();
      } catch (err) {
        alert("Gagal menghapus gedung. Pastikan gedung tidak sedang digunakan.");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Gedung</h1>
          <p className="text-gray-500 text-sm">Kelola daftar gedung dan lokasi operasional kampus.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-orange-100"
        >
          <Plus size={18} /> Tambah Gedung
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((b: any) => (
          <div key={b.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(b)} 
                className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Edit2 size={16}/>
              </button>
              <button 
                onClick={() => handleDelete(b.id)} 
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16}/>
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1 pr-16">{b.name}</h3>
            
            <div className="flex items-center gap-2 text-orange-600 mb-3">
              <UserIcon size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">{b.operatorName}</span>
            </div>

            <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <p className="line-clamp-2">{b.address}</p>
            </div>

            <div className="pt-4 border-t border-gray-50 text-xs text-gray-400 italic">
              {b.description || "Tanpa deskripsi."}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-orange-500 p-6 text-white text-center">
              <h2 className="text-xl font-bold">{editId ? "Edit Gedung" : "Gedung Baru"}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Nama Gedung</label>
                <input 
                  className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-orange-400 focus:bg-white transition-all" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">PJ / Operator</label>
                <input 
                  className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-orange-400 focus:bg-white transition-all" 
                  value={form.operatorName} 
                  onChange={e => setForm({...form, operatorName: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Alamat</label>
                <textarea 
                  className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-orange-400 focus:bg-white transition-all h-24 resize-none" 
                  value={form.address} 
                  onChange={e => setForm({...form, address: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 ml-1 uppercase tracking-widest">Deskripsi</label>
                <input 
                  className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-orange-400 focus:bg-white transition-all" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingPage;