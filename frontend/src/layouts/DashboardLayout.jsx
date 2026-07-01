import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout({
  children,
  activePage = "dashboard",
  user,
  onLogout,
  showHeader = true,
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onLogout={onLogout} />

      <main className="dashboard-main">
        {showHeader && <Header user={user} />}
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;