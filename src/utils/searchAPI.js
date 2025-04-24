const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const getAllPakages = async() => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/packages`);
    const response = await res.json();
    return response;
}

export const bookPackage = async(token,  packageId, services, totalPrice) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            packageId,
            services,
            totalPrice
        })
    })

    const response = await res.json();
    return response;
}

export const getUsersWithBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/packages/user-bookings`);
  return await res.json();
};

export const getPackageStatus = async () => {
  const res = await fetch(`${BASE_URL}/api/packages/package-status`);
  return await res.json();
};

export const getBookingCounts = async () => {
  const res = await fetch(`${BASE_URL}/api/packages/bookings-per-package`);
  return await res.json();
};
