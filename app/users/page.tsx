/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from "react";
import { addUser, deleteUser, getAllUsers, updateUser } from "../utlis/actions";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

interface User {
  id: string;
  nom: string;
  admin: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [nom, setNom] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
 const router = useRouter();
 const [user, setUser] = useState(null);
 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user'); // Endpoint pour récupérer l'utilisateur
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // 🔐 Vérifie si l'utilisateur n'est pas admin
          if (!userData.admin) {
            router.push('/'); // Redirige vers l'accueil si pas admin
          }
        } else {
          router.push('/login'); // Redirige vers login si non connecté
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        router.push('/login'); // Redirige en cas d'erreur
      }
    };

    setTimeout(fetchUser, 10); // Attendre 1 seconde avant d'exécuter fetchUser
  }, []);


  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!nom || !password) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs", "error");
      return;
    }

    setProcessing(true);

    if (editingUser) {
      const confirm = await Swal.fire({
        title: "Confirmer la modification ?",
        text: "Les changements seront appliqués.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui, modifier",
        cancelButtonText: "Annuler",
      });

      if (!confirm.isConfirmed) {
        setProcessing(false);
        return;
      }

      await updateUser(editingUser.id, nom, password, admin);
      Swal.fire("Succès", "Utilisateur modifié avec succès", "success");
    } else {
      await addUser(nom, password, admin);
      Swal.fire("Succès", "Utilisateur ajouté avec succès", "success");
    }

    resetForm();
    fetchUsers();
    setProcessing(false);
  }

  async function handleDelete(id: string) {
    const admins = users.filter(user => user.admin);
    if (admins.length === 1 && admins[0].id === id) {
      Swal.fire("Erreur", "Impossible de supprimer le dernier administrateur !", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
      await deleteUser(id);
      Swal.fire("Supprimé !", "L'utilisateur a été supprimé.", "success");
      fetchUsers();
    }
  }

  function resetForm() {
    setNom("");
    setPassword("");
    setAdmin(false);
    setEditingUser(null);
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-50 mt-5">
      <h1 className="text-xl font-bold mb-4 text-center">Gestion des Utilisateurs</h1>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            className="mr-2"
          /> Admin
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className={`px-3 py-1 rounded w-full ${processing ? "bg-gray-400" : "bg-blue-500 text-white"}`}
            disabled={processing}
          >
             <IoIosAddCircle className="inline mr-2  text-2xl"/>{processing ? "En cours..." : editingUser ? "Modifier" : "Ajouter"}
          </button>
          {editingUser && (
            <button onClick={resetForm} className="bg-gray-500 text-white px-3 py-1 rounded w-full">
              Annuler
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader/>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-white">
                <th className="p-2 border">Nom</th>
                <th className="p-2 border">Admin</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="p-2 border text-center">{user.nom}</td>
                  <td className="p-2 border text-center">{user.admin ? "Oui" : "Non"}</td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setNom(user.nom);
                        setAdmin(user.admin);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                       <FaEdit className="text-xl"  />
    
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
      )}
    </div>
  );
}
