import { useAuth } from "../../context/AuthContext";

import MainLayout from "../../components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <h1>Home Feed</h1>
      <p>Connectify home page is working.</p>
    </MainLayout>
  );
}
