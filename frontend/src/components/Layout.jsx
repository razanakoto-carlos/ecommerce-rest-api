import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#242426",
            border: "1px solid #E7E0E6",
            boxShadow: "0 12px 28px rgba(36, 36, 38, 0.12)",
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#24876F", secondary: "#FFFFFF" } },
          error: { iconTheme: { primary: "#C2506D", secondary: "#FFFFFF" } },
        }}
      />
    </div>
  );
}
