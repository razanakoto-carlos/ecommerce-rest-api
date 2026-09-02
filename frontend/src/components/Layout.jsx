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
            background: "#1E1D3D",
            color: "#F4F2FF",
            border: "1px solid #35316B",
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#34E2C0", secondary: "#14132B" } },
          error: { iconTheme: { primary: "#FF4D6D", secondary: "#14132B" } },
        }}
      />
    </div>
  );
}
