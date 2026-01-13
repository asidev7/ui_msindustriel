import { useEffect, useState } from "react";
import {
  getDocuments,
  deleteDocument,
  uploadDocument,
  type UploadedDocument,
} from "../services/api";

import {
  XMarkIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function DocumentTable() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [actionOpen, setActionOpen] = useState<number | null>(null);

  // Load docs
  const fetchDocuments = async () => {
    const data = await getDocuments();
    setDocuments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadDocument(selectedFile);
    setSelectedFile(null);
    setModalOpen(false);
    fetchDocuments();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce document ?")) {
      await deleteDocument(id);
      fetchDocuments();
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-500">Chargement...</p>;

  const filteredDocs = documents.filter((d) =>
    d.file.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "validé":
        return "bg-green-100 text-green-700";
      case "en attente":
        return "bg-yellow-100 text-yellow-700";
      case "rejeté":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Documents
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition"
        >
          <PlusIcon className="h-5 w-5" />
          Ajouter
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border w-full md:w-1/3 px-3 py-2 rounded-lg mb-4 shadow-sm focus:ring focus:ring-blue-200"
      />

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDocs.map((doc) => (
              <tr
                key={doc.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  {doc.file.endsWith(".pdf") ? (
                    <span
                      className="text-red-500 underline cursor-pointer"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      PDF
                    </span>
                  ) : (
                    <img
                      src={doc.file}
                      className="w-14 h-14 rounded-lg shadow object-cover cursor-pointer"
                      onClick={() => setPreviewDoc(doc)}
                    />
                  )}
                </td>

                <td className="px-4 py-3">
                  {doc.file.split("/").pop()}
                </td>

                <td className="px-4 py-3">
                  {new Date(doc.uploaded_at).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 text-center relative">
                  <button
                    onClick={() =>
                      setActionOpen(actionOpen === doc.id ? null : doc.id)
                    }
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                  >
                    <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
                  </button>

                  {actionOpen === doc.id && (
                    <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-40 z-20 animate-fadeIn">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        <PencilIcon className="h-5 w-5 mr-2 text-blue-500" />
                        Voir
                      </button>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                      >
                        <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setPreviewDoc(null)}
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-black" />
            </button>

            {previewDoc.file.endsWith(".pdf") ? (
              <iframe src={previewDoc.file} className="w-full h-96 rounded" />
            ) : (
              <img
                src={previewDoc.file}
                className="w-full h-auto rounded-lg shadow"
              />
            )}
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Ajouter un document</h2>

            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="border rounded-lg px-3 py-2 w-full"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Annuler
              </button>

              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-lg text-white shadow ${
                  selectedFile
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
