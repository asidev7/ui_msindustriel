import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import TimesheetTable from "./pages/Feuille";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Upload />} />
        <Route path="/timesheets" element={<TimesheetTable />} />

      </Routes>
    </Layout>
  );
}

export default App;
