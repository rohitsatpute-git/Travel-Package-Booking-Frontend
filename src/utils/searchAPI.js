const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token')

export const login = async(email, password, url) => {
    const res = await fetch(url, {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await res.json();
    return response;
}


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

export const fetchUser = async () => {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
};

export const fetchBookings = async () => {
  const res = await fetch(`${BASE_URL}/api/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
};

export const updateUser = async (user) => {
  const res = await fetch(`${BASE_URL}/api/users/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  return data;
};

export const getPackages = async () => {
  const res = await fetch(`${BASE_URL}/api/packages`);
  const data = await res.json();
  return data;
};

