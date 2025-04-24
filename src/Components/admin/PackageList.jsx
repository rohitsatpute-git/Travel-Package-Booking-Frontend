import React, { useEffect, useState } from 'react';
import { getUsersWithBookings, getPackageStatus, getBookingCounts } from '../../utils/searchAPI';
import { ArrowRight } from 'lucide-react';
export default function PackageList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({ completed: [], active: [], upcoming: [] });
  const [bookingStats, setBookingStats] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    // await getUsersWithBookings()
    const [userData, statusData, statsData] = await Promise.all([
      getUsersWithBookings(),
      getPackageStatus(),
      getBookingCounts()
    ]);
    setUsers(userData);
    setStatus(statusData);
    setBookingStats(statsData);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
  {/* Users and Bookings */}
  <section className="border p-4 rounded-xl shadow-md">
    <h2 className="text-lg md:text-xl font-bold mb-4">Users & Bookings</h2>
    {users.map(user => (
      <div key={user._id} className="mb-4">
        <p className="font-semibold">{user.name || user.email}</p>
        <ul className="ml-4 list-disc">
          {user.bookings?.map(b => (
            <li key={b._id} className={`flex items-center gap-x-2 ${!b.package && 'hidden'}`}>
              <span>Package:</span>
              <span>{b.package?.from}</span>
              <ArrowRight />
              <span>{b.package?.to}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>

  {/* Package Status */}
  <section className="border p-4 rounded-xl shadow-md">
    <h2 className="text-lg md:text-xl font-bold mb-4">Package Status</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['completed', 'active', 'upcoming'].map(type => (
        <div key={type}>
          <h3 className="font-semibold capitalize">{type}</h3>
          <ul className="ml-2 list-disc flex flex-col gap-y-4 p-2">
            {status[type]?.map(pkg => (
              <li key={pkg._id}>
                <div className='flex flex-col gap-y-1'>
                  <div className='flex flex-wrap gap-x-2'>
                    <span>{pkg.from}</span>
                    <ArrowRight />
                    <span>{pkg.to}</span>
                  </div>
                  <div className='text-sm text-gray-600 flex gap-x-4'>
                    <span>{new Date(pkg.startDate).toLocaleDateString()}</span>
                    <span>{new Date(pkg.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>

  {/* Bookings Per Package */}
  <section className="border p-4 rounded-xl shadow-md overflow-x-auto">
    <h2 className="text-lg md:text-xl font-bold mb-4">Bookings Per Package</h2>
    <table className="min-w-full border text-left text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Package</th>
          <th className="border px-4 py-2">Booking Count</th>
        </tr>
      </thead>
      <tbody>
        {bookingStats.map(item => (
          <tr key={item.package._id}>
            <td className="border px-4 py-2">
              <div className='flex flex-wrap gap-x-2'>
                <span>{item.package.from}</span>
                <ArrowRight />
                <span>{item.package.to}</span>
              </div>
            </td>
            <td className="border px-4 py-2">{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
</div>

  );
}
