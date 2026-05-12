import { useState, useEffect, useRef } from "react";
import { getImages, getImageCategories, uploadImage, deleteImage, getJobSites } from "../utils/api";
import Navbar from "../components/common/Navbar";
import { Page, PageHeader, Card, Btn, Field, Spinner, Empty } from "../components/common/UI";

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobSites, setJobSites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", category_id: "", job_site_id: "" });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  const fetchImages = async (categorySlug = "") => {
    setLoading(true);
    try {
      const res = await getImages(categorySlug ? { category: categorySlug } : {});
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([getImageCategories(), getJobSites()]).then(([catRes, siteRes]) => {
      setCategories(catRes.data);
      setJobSites(siteRes.data);
    });
    fetchImages();
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = selectedFile || fileRef.current?.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);
    fd.append("category", categories.find((c) => c.id === parseInt(form.category_id))?.slug || "general");
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    setUploading(true);
    try {
      const res = await uploadImage(fd);
      setImages((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", category_id: "", job_site_id: "" });
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <Page>
        <PageHeader title="Images" subtitle="Upload & browse by category" />

        {/* Upload panel */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 28,
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              Upload Image
            </span>
          </div>
          <form onSubmit={handleUpload} style={{ padding: 20 }}>
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 6,
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 16,
                background: dragOver ? "var(--accent-dim)" : "var(--bg-elevated)",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              {selectedFile ? (
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{selectedFile.name}</div>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Drop image here or click to browse</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>JPG, PNG, WEBP up to 10MB</div>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Title">
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Optional title" />
              </Field>
              <Field label="Category">
                <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Job site">
                <select value={form.job_site_id} onChange={(e) => setForm((f) => ({ ...f, job_site_id: e.target.value }))}>
                  <option value="">No specific site</option>
                  {jobSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Description">
                <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
              </Field>
            </div>

            <div style={{ marginTop: 16 }}>
              <Btn type="submit" disabled={uploading || (!selectedFile && !fileRef.current?.files[0])}>
                {uploading ? "Uploading..." : "Upload Image"}
              </Btn>
            </div>
          </form>
        </div>

        {/* Category filter pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {[{ slug: "", name: "All" }, ...categories].map((c) => (
            <button
              key={c.slug}
              onClick={() => { setActiveCategory(c.slug); fetchImages(c.slug); }}
              style={{
                background: activeCategory === c.slug ? "var(--accent)" : "var(--bg-surface)",
                color: activeCategory === c.slug ? "#0f1117" : "var(--text-secondary)",
                border: `1px solid ${activeCategory === c.slug ? "var(--accent)" : "var(--border)"}`,
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 20,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.15s",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Image grid */}
        {loading ? (
          <Spinner />
        ) : images.length === 0 ? (
          <Empty message="No images yet. Upload one above." />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}>
            {images.map((img) => (
              <div
                key={img.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
                className="group"
              >
                <img
                  src={img.url}
                  alt={img.title || "Image"}
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "10px 12px" }}>
                  {img.title && (
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {img.title}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {img.category_name || "Uncategorized"}
                    </span>
                    <button
                      onClick={() => handleDelete(img.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: 12,
                        padding: "2px 4px",
                        borderRadius: 4,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  {img.job_site_name && (
                    <div style={{ fontSize: 11, color: "var(--blue)", marginTop: 2 }}>📍 {img.job_site_name}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Page>
    </div>
  );
};

export default ImagesPage;
