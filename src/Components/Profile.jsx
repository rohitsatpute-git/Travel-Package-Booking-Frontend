import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getUserFromToken } from "../utils/auth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchUser, fetchBookings, updateUser } from "../utils/searchAPI";

const Profile = () => {
  const [user, setUser] = useState(getUserFromToken());
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUser = async () => {
      const data = await fetchUser();
      setUser(data);
    };

    const getBookings = async () => {
      const data = await fetchBookings();
      setBookings(data);
    };

    getUser();
    getBookings();
  }, [token]);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    const data = await updateUser(user);
    alert("Profile Updated");
    setUser(data);
    setUpdating(false);
  };

  const filteredBookings = bookings.filter((b) => {
    const now = dayjs();
    const start = dayjs(b.package.startDate);
    const end = dayjs(b.package.endDate);

    if (filter === "upcoming") return start.isAfter(now);
    if (filter === "active") return now.isAfter(start) && now.isBefore(end);
    if (filter === "completed") return end.isBefore(now);
    return true;
  });
  
  const backToHome = useCallback(() => {
     navigate('/');
  }, [])

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md lg:mt-6 rounded">
      <ArrowLeft className="lg:fixed top-8 left-8 cursor-pointer w-10 h-10" onClick={backToHome}/>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" className="border p-2 rounded" placeholder="Name" value={user.name || ""} onChange={handleInputChange}/>
        <input name="email" className="border p-2 rounded" value={user.email || ""} readOnly/>
        <input name="address" className="border p-2 rounded" placeholder="Address" value={user.address || ""} onChange={handleInputChange}/>
      </div>
      <button onClick={handleUpdate} disabled={updating} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {updating ? "Updating..." : "Update Profile"}
      </button>

      <h3 className="text-xl font-semibold mt-8 mb-2">My Bookings</h3>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "upcoming", "active", "completed"].map((f) => (
          <button key={f} className={`px-3 py-1 border rounded ${ filter === f ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredBookings.map((b) => (
        <div key={b._id} className="border rounded p-4 mb-3 shadow-sm bg-gray-50">
          <p>
            <strong>Trip:</strong> {b.package.from} → {b.package.to}
          </p>
          <p>
            <strong>Dates:</strong>{" "}
            {dayjs(b.package.startDate).format("DD MMM")} -{" "}
            {dayjs(b.package.endDate).format("DD MMM")}
          </p>
          <p>
            <strong>Services:</strong> {b.services.join(", ")}
          </p>
          <p>
            <strong>Total:</strong> ₹{b.totalPrice}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
