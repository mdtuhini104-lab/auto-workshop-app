"use client";

export default function LogoutButton() {

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies holding JWT auth token
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force hard state reset without trailing slash
    window.location.href = '/login';
  };

  return (
    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
      Logout
    </button>
  );
}
