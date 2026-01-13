import { useEffect, useState } from "react"
import { getDocuments, getTimesheets, getInvoices } from "../services/api"

export default function Home() {
  const [docCount, setDocCount] = useState(0)
  const [pendingDocs, setPendingDocs] = useState(0)

  const [timesheetsCount, setTimesheetsCount] = useState(0)
  const [invoicesCount, setInvoicesCount] = useState(0)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const docs = await getDocuments()
    const timesheets = await getTimesheets()
    const invoices = await getInvoices()

    setDocCount(docs.length)
    setPendingDocs(docs.filter(d => d.status === "pending").length)

    setTimesheetsCount(timesheets.length)
    setInvoicesCount(invoices.length)
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          label="Documents"
          value={docCount}
          color="bg-blue-600"
        />

        <Card
          label="En attente"
          value={pendingDocs}
          color="bg-yellow-500"
        />

        <Card
          label="Timesheets"
          value={timesheetsCount}
          color="bg-indigo-500"
        />

        <Card
          label="Invoices"
          value={invoicesCount}
          color="bg-green-600"
        />
      </div>
    </div>
  )
}

function Card({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl flex flex-col justify-center items-start">
      <span className="text-gray-500 text-sm">{label}</span>
      <strong className="text-3xl font-bold mt-2">{value}</strong>
      <div className={`${color} h-1 w-full rounded mt-4`} />
    </div>
  )
}
