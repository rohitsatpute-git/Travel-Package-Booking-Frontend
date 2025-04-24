import { useEffect, useState } from "react";
import PackageList from "./PackageList";

const initialForm = {
  from: "",
  to: "",
  startDate: "",
  endDate: "",
  basePrice: "",
  services: {
    food: false,
    accommodation: false,
  },
};

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const fetchPackages = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/packages`);
    const data = await res.json();
    setPackages(data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "food" || name === "accommodation") {
      setForm((prev) => ({
        ...prev,
        services: { ...prev.services, [name]: checked },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      services: Object.entries(form.services)
        .filter(([_, val]) => val)
        .map(([key]) => key),
    };

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/packages${editId ? "/" + editId : ""}`,
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      fetchPackages();
      setForm(initialForm);
      setEditId(null);
    }
  };

  const handleEdit = (pkg) => {
    setForm({
      from: pkg.from,
      to: pkg.to,
      startDate: pkg.startDate.split("T")[0],
      endDate: pkg.endDate.split("T")[0],
      basePrice: pkg.basePrice,
      services: {
        food: pkg.services.includes("food"),
        accommodation: pkg.services.includes("accommodation"),
      },
    });
    setEditId(pkg._id);
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchPackages();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{editId ? "Edit" : "Add"} Travel Package</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-8">
        <input className="border p-2 rounded" name="from" value={form.from} onChange={handleChange} placeholder="From" required />
        <input className="border p-2 rounded" name="to" value={form.to} onChange={handleChange} placeholder="To" required />
        <input type="date" className="border p-2 rounded" name="startDate" value={form.startDate} onChange={handleChange} required />
        <input type="date" className="border p-2 rounded" name="endDate" value={form.endDate} onChange={handleChange} required />
        <input type="number" className="border p-2 rounded" name="basePrice" value={form.basePrice} onChange={handleChange} placeholder="Base Price" required />
        <div className="flex items-center gap-4 col-span-2">
          <label><input type="checkbox" name="food" checked={form.services.food} onChange={handleChange} /> Food</label>
          <label><input type="checkbox" name="accommodation" checked={form.services.accommodation} onChange={handleChange} /> Accommodation</label>
        </div>
        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">{editId ? "Update" : "Add"} Package</button>
      </form>

      <h2 className="text-xl font-semibold mb-4">All Packages</h2>
      <div className="grid gap-4">
        {packages.map(pkg => (
          <div key={pkg._id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{pkg.from} → {pkg.to}</h3>
              <div className="space-x-2">
                <button onClick={() => handleEdit(pkg)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(pkg._id)} className="text-red-600">Delete</button>
              </div>
            </div>
            <p>{pkg.startDate.split("T")[0]} → {pkg.endDate.split("T")[0]}</p>
            <p>₹{pkg.basePrice}</p>
            <p>Includes: {pkg.services.join(", ")}</p>
          </div>
        ))}
      </div>
      <PackageList/>
    </div>
  );
};

export default AdminDashboard;
