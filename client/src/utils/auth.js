export function getUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const base64 = token.split(".")[1];
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAdmin() {
  return getUser()?.role === "admin";
}