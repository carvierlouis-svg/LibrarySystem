import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API = "http://localhost:3001/siswa";

function TabelSiswa() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function ambilData() {
    try {
      const response = await axios.get(API);
      setSiswa(response.data);
    } catch (error) {
      Swal.fire(
        "Error",
        "Gagal mengambil data siswa. pastikan JSON Server berjalan.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  async function hapusSiswa(id) {
    const yakin = await Swal.fire({
      title: "Yg bener?",
      text: "Gk bakal balik lho",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "yeah, hapus",
      cancelButtonText: "g jd"
    });

    if (!yakin.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);

      setSiswa((data) => data.filter((item) => item.id !== id));

      Swal.fire({
        icon: "success",
        title: "Ya.",
        text: "Dh di apus"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menghapus siswa."
      });
    }
  }

  return (
    <div className="container">
      <h2>Data Siswa</h2>

      <button
        className="btn-tambah"
        onClick={() => navigate("/siswa/tambah")}
      >
        + Tambah Siswa
      </button>

      {/* Bagian tabel/daftar siswa yang dilengkapi */}
      {loading ? (
        <p>Memuat data...</p>
      ) : siswa.length === 0 ? (
        <p>Belum ada data siswa.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NIS</th>
              <th>Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama}</td>
                <td>{item.nis}</td>
                <td>{item.kelas}</td>
                <td>
                  <button
                    onClick={() => navigate(`/siswa/edit/${item.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => hapusSiswa(item.id)}
                    style={{ marginLeft: "5px", color: "red" }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TabelSiswa;