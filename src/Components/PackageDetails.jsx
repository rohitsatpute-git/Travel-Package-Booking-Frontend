import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { bookPackage } from "../utils/searchAPI";

const PackageDetail = ({pkg, setPkgDetail}) => {
  const { id } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const getTotalPrice = () => {
    if (!pkg) return 0;
    let total = pkg.basePrice;
    if (selectedServices.includes("food")) total += 500;
    if (selectedServices.includes("accommodation")) total += 1000;
    return total;
  };

  const handleBooking = async () => {
    setSubmitting(true);
    const totalPrice = getTotalPrice();
    const res = await bookPackage(localStorage.getItem('token'), pkg._id, selectedServices,  totalPrice);
    setSubmitting(false);
  };

  const onCancelClicked = useCallback(() => {
    setPkgDetail(null)
  }, [])


  return (
    <div className="fixed inset-0 flex flex-col z-[1] bg-[#000]/40 w-screen h-screen">
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 relative">
            <Plus className="absolute top-2 right-2 rotate-45" onClick={onCancelClicked}/>
            <h2 className="text-2xl font-bold mb-4">{pkg.from} → {pkg.to}</h2>
            <p><strong>Start Date:</strong> {new Date(pkg.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(pkg.endDate).toLocaleDateString()}</p>
            <p><strong>Base Price:</strong> ₹{pkg.basePrice}</p>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Customize Services:</h3>
                {["food", "accommodation"].map((service) => (
                <label key={service} className="flex items-center space-x-2 mb-2">
                    <input type="checkbox" checked={selectedServices.includes(service)} onChange={() => toggleService(service)} className="form-checkbox"/>
                    <span className="capitalize">{service}</span>
                </label>
                ))}
            </div>

            <div className="mt-4">
                <p className="font-medium text-lg">Total Price: ₹{getTotalPrice()}</p>
            </div>

            <button onClick={handleBooking} disabled={submitting} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {submitting ? "Booking..." : "Submit Booking"}
            </button>
        </div>
    </div>
  );
};

export default PackageDetail;
