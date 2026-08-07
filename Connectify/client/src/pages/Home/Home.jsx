import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Connectify, {user?.name}! 🎉</h1>
      <p>Feed will go here soon.</p>
      <button onClick={logout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}
