import { useState, useEffect } from "react";
import { getEquipment, getJobSites, assignEquipment, deleteEquipment } from "../utils/api";
import Navbar from "../components/common/Navbar";
import EquipmentCard from "../components/equipment/EquipmentCard";
import AddEquipmentModal from "../components/equipment/AddEquipmentModal";
import { Page, PageHeader, Btn, StatCard, Spinner, Empty } from "../components/common/UI";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [jobSites, setJobSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterSite, setFilterSite] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    Promise.all([getEquipment(), getJobSites()]).then(([eqRes, siteRes]) => {
      setEquipment(eqRes.data);
      setJobSites(siteRes.data);
      setLoading(false);
    });
  }, []);

  const handleAssign = async (id, job_site_id) => {
    try {
      const res = await assignEquipment(id, job_site_id);
      setEquipment((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, job_site_id: res.data.job_site_id, status: res.data.status, job_site_name: jobSites.find((s) => s.id === parseInt(res.data.job_site_id))?.name || null }
            : e
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = equipment.filter((e) => {
    if (filterSite && String(e.job_site_id) !== filterSite) return false;
    if (filterStatus && e.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    total: equipment.length,
    available: equipment.filter((e) => e.status === "available").length,
    assigned: equipment.filter((e) => e.status === "assigned").length,
    maintenance: equipment.filter((e) => e.status === "maintenance").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <Page>
        <PageHeader
          title="Equipment"
          subtitle="Manage & assign field equipment"
          action={<Btn onClick={() => setShowModal(true)}>+ Add Equipment</Btn>}
        />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Available" value={counts.available} color="var(--green)" />
          <StatCard label="Assigned" value={counts.assigned} color="var(--blue)" />
          <StatCard label="Maintenance" value={counts.maintenance} color="var(--accent)" />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, alignItems: "center" }}>
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            style={{ width: "auto", minWidth: 160 }}
          >
            <option value="">All sites</option>
            {jobSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: "auto", minWidth: 140 }}
          >
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
          <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <Empty message="No equipment found. Add some above." />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}>
            {filtered.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                jobSites={jobSites}
                onAssign={handleAssign}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Page>

      {showModal && (
        <AddEquipmentModal
          jobSites={jobSites}
          onClose={() => setShowModal(false)}
          onAdded={(item) => setEquipment((prev) => [item, ...prev])}
        />
      )}
    </div>
  );
};

export default EquipmentPage;
