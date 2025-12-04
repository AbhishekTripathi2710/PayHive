
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "space_dashboard", label: "Dashboard", path: "/dashboard" },
    { icon: "subscriptions", label: "Subscriptions", path: "/subscriptions" },
    { icon: "article", label: "Invoices", path: "/invoices" },
    { icon: "payments", label: "Payments", path: "/payments" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="flex w-64 flex-col gap-8 border-r border-slate-200 bg-white font-display">
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-primary text-white h-10 w-10 text-sm font-semibold">
            PH
          </div>

          <div className="flex flex-col">
            <h1 className="text-slate-900 font-bold text-base">
              PayHive
            </h1>
            <p className="text-slate-500 text-sm">
              Billing Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <nav className="flex flex-col gap-1 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-primary border border-blue-100"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-symbols-outlined text-base">
              {item.icon}
            </span>
            <p>{item.label}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
