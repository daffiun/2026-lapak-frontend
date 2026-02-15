import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Booking } from '../types';

const BookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Fungsi untuk mengambil data dari backend
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5298/api/booking`, {
        params: { status, search } // Menggunakan filter yang sudah kita buat di backend
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [status]); // Ambil data tiap kali filter status berubah

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await axios.patch(`http://localhost:5298/api/booking/${id}/status`, `"${newStatus}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
    fetchData(); // Refresh data
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sistem Peminjaman Ruangan Kampus</h2>

      {/* Bagian Filter & Pencarian */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Cari Nama/NRP..." 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button onClick={fetchData}>Cari</button>
        
        <select onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {/* Tabel Riwayat Peminjaman */}
      <table border={1} width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Peminjam</th>
            <th>Ruangan</th>
            <th>Waktu</th>
            <th>Status</th>
            <th>Aksi Petugas</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.borrowerName} <br/> <small>{b.borrowerNrp}</small></td>
              <td>{b.room?.name}</td>
              <td>{new Date(b.startDate).toLocaleString()}</td>
              <td><strong>{b.status}</strong></td>
              <td>
                <button onClick={() => handleUpdateStatus(b.id, 'Disetujui')}>Setujui</button>
                <button onClick={() => handleUpdateStatus(b.id, 'Ditolak')}>Tolak</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDashboard;