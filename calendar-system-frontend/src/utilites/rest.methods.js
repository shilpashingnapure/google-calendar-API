import Cookies from "js-cookie";

export const MAIN_URL = process.env.NODE_ENV == 'production' ? 'https://google-calendar-api.onrender.com' : 'http://localhost:8000';

const token = Cookies.get("authToken");

export async function getMethod(endPoint) {
  try {
    const res = await fetch(MAIN_URL + endPoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function postMethod(endPoint, event) {
  try {
    await fetch(MAIN_URL + endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    return;
  } catch (err) {
    console.log(err);
  }
}

export async function updateMethod(endPoint, updateEvent) {
  try {
    await fetch(MAIN_URL + endPoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateEvent),
    });

    return;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteMethod(endPoint) {
  try {
    await fetch(MAIN_URL + endPoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return;
  } catch (err) {
    console.log(err);
  }
}
