import { useState, useEffect, useCallback } from "react";
import { getAllPakages } from "../utils/searchAPI";
import PackageDetail from "./PackageDetails";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import { User } from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState({from: "", to: "", startDate: "", endDate: "", sort: "lowToHigh",});
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [allPakages, setAllPakages] = useState(null);
  const [pkgDetail, setPkgDetail] = useState(null);
  const navigate = useNavigate();

  const fetchPakages = async() => {
     const allPakages = await getAllPakages();
     setAllPakages(allPakages)
  }

  useEffect(() => {
    fetchPakages();
  }, [])

  useEffect(() => {
    if(!allPakages) return
    let filtered = allPakages.filter(pkg => {
      return (
        (!filters.from || pkg.from.toLowerCase().includes(filters.from.toLowerCase())) &&
        (!filters.to || pkg.to.toLowerCase().includes(filters.to.toLowerCase())) &&
        (!filters.startDate || pkg.startDate >= filters.startDate) &&
        (!filters.endDate || pkg.endDate <= filters.endDate)
      );
    });

    if (filters.sort === "lowToHigh") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredPackages(filtered);
  }, [allPakages, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const onPackageClicked = useCallback((pkg) => {
    setPkgDetail(pkg)
  }, [])

  const onLogout = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/login')
  }, [])

  const profileClicked = useCallback(() => {
    navigate('/profile');
  }, [])

 
  return (
    <div className=" inset-0 z-[0] flex flex-col justify-center">
        <div className="p-6 w-full mx-auto relative px-60">
          <div className="absolute top-2 right-2 px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer" onClick={onLogout}>Logout</div>
          <User className="fixed top-8 left-8 cursor-pointer border rounded-full w-12 h-12" onClick={profileClicked}/>
          <h1 className="text-2xl font-bold mb-4">Find Your Travel Package</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow mb-6">
            <input name="from" type="text" placeholder="From" value={filters.from} onChange={handleChange} className="border p-2 rounded"/>
            <input name="to" type="text" placeholder="To" value={filters.to} onChange={handleChange} className="border p-2 rounded"/>
            <input name="startDate" type="date" value={filters.startDate} onChange={handleChange} className="border p-2 rounded"/>
            <input name="endDate" type="date" value={filters.endDate} onChange={handleChange} className="border p-2 rounded"/>
            <select name="sort" value={filters.sort} onChange={handleChange} className="border p-2 rounded">
              <option value="lowToHigh">Sort by Price: Low to High</option>
              <option value="highToLow">Sort by Price: High to Low</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredPackages.length === 0 ? (
              <p className="text-gray-500">No packages found.</p>
            ) : (
              filteredPackages.map(pkg => (
                <div key={pkg.id} className="bg-white border rounded-xl p-4 shadow flex justify-between" onClick={e => onPackageClicked(pkg)}>
                  <div>
                    <p className="font-semibold text-lg">{pkg.from} → {pkg.to}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(pkg.startDate).toLocaleDateString()} to {new Date(pkg.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold text-xl">₹{pkg.basePrice}</p>
                    <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pkgDetail && <PackageDetail pkg={pkgDetail} setPkgDetail={setPkgDetail}/>}

        </div>
    </div>
  );
}
