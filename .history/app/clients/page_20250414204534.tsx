/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { addClient, deleteClient, getAllClients, updateClient } from "../utlis/actions";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Loader from "../components/Loader";

interface Client {
  id: string;
  nom: string;
  tel: string;
  nif: string | null;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [nif, setNif] = useState("");
  const [search, setSearch] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("خطأ أثناء جلب المستخدم :", error);
        router.push('/login');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, clients]);

  async function fetchClients() {
    setLoading(true);
    try {
      const data = await getAllClients();
      if (data.success) {
        setClients(data.clients);
        setFilteredClients(data.clients);
      } else {
        throw new Error(data.error || "تعذر جلب العملاء");
      }
    } catch (error) {
      Swal.fire("خطأ", error instanceof Error ? error.message : "حدث خطأ غير معروف", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const filtered = clients.filter(client =>
      client.nom.toLowerCase().includes(search.toLowerCase()) ||
      (client.nif && client.nif.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredClients(filtered);
    setCurrentPage(1);
  }

  async function handleSubmit() {
    if (!nom || !tel) {
      Swal.fire("خطأ", "يرجى ملء جميع الحقول الإلزامية", "error");
      return;
    }

    if (editingClient) {
      const result = await updateClient(editingClient.id, nom, tel, nif);
      if (result.success) {
        Swal.fire("نجاح", "تم تعديل العميل بنجاح", "success");
      } else {
        Swal.fire("خطأ", result.error || "فشل التعديل", "error");
      }
    } else {
      const result = await addClient(nom, tel, nif || null);
      if (result.success) {
        Swal.fire("نجاح", "تمت إضافة العميل بنجاح", "success");
      } else {
        Swal.fire("خطأ", result.error || "فشل الإضافة", "error");
      }
    }
    resetForm();
    fetchClients();
  }

  async function handleDelete(id: string) {
    const confirm = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "هذا الإجراء لا يمكن التراجع عنه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      const result = await deleteClient(id);
      if (result.success) {
        Swal.fire("تم الحذف", "تم حذف العميل.", "success");
        fetchClients();
      } else {
        Swal.fire("خطأ", result.error || "فشل الحذف", "error");
      }
    }
  }

  function resetForm() {
    setNom("");
    setTel("");
    setNif("");
    setEditingClient(null);
  }

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  function nextPage() {
    if (currentPage < Math.ceil(filteredClients.length / clientsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white mt-5 text-black" dir="rtl">
      <h1 className="text-xl font-bold mb-4 text-center">إدارة العملاء</h1>

      <input
        type="text"
        placeholder="ابحث بالاسم أو الرقم الضريبي"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="text"
          placeholder="الاسم"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="الهاتف"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="الرقم الضريبي (اختياري)"
          value={nif}
          onChange={(e) => setNif(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded w-full">
            <IoIosAddCircle className="inline ml-2 text-2xl" />
            {editingClient ? "تعديل" : "إضافة"}
          </button>
          {editingClient && (
            <button onClick={resetForm} className="bg-gray-500 text-white px-3 py-1 rounded w-full">
              إلغاء
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-white">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">الهاتف</th>
              <th className="p-2 border">الرقم الضريبي</th>
              <th className="p-2 border">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client) => (
              <tr key={client.id} className="border">
                <td className="p-2 border text-center">{client.nom}</td>
                <td className="p-2 border text-center">{client.tel}</td>
                <td className="p-2 border text-center">{client.nif || ""}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setNom(client.nom);
                      setTel(client.tel);
                      setNif(client.nif || "");
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    <FaEdit className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    <MdOutlineDelete className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 mx-1 rounded">السابق</button>
        <button onClick={nextPage} disabled={indexOfLastClient >= filteredClients.length} className="px-4 py-2 bg-gray-300 mx-1 rounded">التالي</button>
      </div>
    </div>
  );
}
