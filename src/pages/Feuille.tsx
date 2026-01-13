import { useEffect, useState } from "react";
import {
  getTimesheets,
  deleteTimesheet,
  createTimesheet,
} from "../services/api";
import type { WeeklyTimesheet } from "../types/types";
import { useNavigate } from "react-router-dom";

export default function TimesheetTable() {
  const [data, setData] = useState<WeeklyTimesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<WeeklyTimesheet | null>(null);
  const [openCreate, setOpenCreate] = useState<boolean>(false);

  const [form, setForm] = useState<Omit<WeeklyTimesheet, "id">>({
    name: "",
    vehicle: "",
    week_start: "",
    week_end: "",
    city: "",
    client_id: 0,
    consumables: "",
    status: "pending",
    document_id: 0,
    entries: [],
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    document: {
      extracted_json: {},
      km_total: "",
      consumables: "",
      status: "pending",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const res = await getTimesheets();
      setData(res);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Supprimer ce timesheet ?")) return;

    try {
      await deleteTimesheet(id);
      loadData();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await createTimesheet(form);
      setOpenCreate(false);
      loadData();
    } catch (err) {
      console.error("Erreur création :", err);
    }
  };

  const updateForm = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div className="p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des Timesheets</h2>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Véhicule</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Ville</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.vehicle ?? "—"}</td>
                <td className="p-3">{item.client?.name ?? "—"}</td>
                <td className="p-3">{item.city ?? "—"}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${
                      item.status === "pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : item.status === "validated"
                        ? "bg-green-200 text-green-700"
                        : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2 justify-center">

                  <button
                    onClick={() => setSelected(item)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Voir
                  </button>

                  <button
                    onClick={() => navigate(`/timesheets/edit/${item.id}`)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{selected.name}</h3>

            <div className="space-y-2">
              <p><strong>Véhicule :</strong> {selected.vehicle}</p>
              <p><strong>Ville :</strong> {selected.city}</p>
              <p><strong>Client :</strong> {selected.client?.name}</p>
              <p><strong>Semaine :</strong> {selected.week_start} → {selected.week_end}</p>
              <p><strong>Kilométrage :</strong> {selected.document?.km_total}</p>
              <p><strong>Statut :</strong> {selected.status}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Fermer
              </button>

              <button
                onClick={() => navigate(`/timesheets/${selected.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ouvrir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {openCreate && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setOpenCreate(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Nouveau Timesheet</h3>

            <form onSubmit={handleCreate} className="space-y-3">

              <input
                type="text"
                placeholder="Nom"
                className="w-full border rounded p-2"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Véhicule"
                className="w-full border rounded p-2"
                value={form.vehicle}
                onChange={(e) => updateForm("vehicle", e.target.value)}
              />

              <input
                type="text"
                placeholder="Ville"
                className="w-full border rounded p-2"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
              />

              <input
                type="date"
                className="w-full border rounded p-2"
                value={form.week_start}
                onChange={(e) => updateForm("week_start", e.target.value)}
                required
              />

              <input
                type="date"
                className="w-full border rounded p-2"
                value={form.week_end}
                onChange={(e) => updateForm("week_end", e.target.value)}
                required
              />

              <select
                className="w-full border rounded p-2"
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
              >
                <option value="pending">En attente</option>
                <option value="validated">Validé</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Créer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
