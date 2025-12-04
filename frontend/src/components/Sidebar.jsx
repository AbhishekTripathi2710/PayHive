// src/components/Sidebar.jsx
export default function Sidebar() {
  const menuItems = [
    { icon: "dashboard", label: "Dashboard" },
    { icon: "subscriptions", label: "Subscriptions" },
    { icon: "group", label: "Customers" },
    { icon: "receipt_long", label: "Invoices" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <aside className="flex w-64 flex-col gap-8 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-4 font-display">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div
          className="bg-center bg-cover aspect-square rounded-full size-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCSiWJTuvMANEjgRnW5DhQjD0jPUROzlfue_bgrY95BSTSORkUaSm_kFBJM2qbMPBSIwlr2q0Cdw3LZzq-exxKQZnKPj456o6n0x-9OIV1ipVhRHSkK4gYujYZDpgQcE9udSYf_W5qHb2URYJDdzpwOYh_4di-07U1-KkFEWj3x9rt86PtqwBoI1NghWV52TxerWbvTzfVzRj0sHZrSJICseqctCkPYtKAmduyq5sAD18s4uR_8mYUBSY5BL_03wKjMIND2TsJvXW1T')",
          }}
        ></div>

        <div className="flex flex-col">
          <h1 className="text-[#111418] dark:text-slate-200 font-bold text-base">
            PayHive
          </h1>
          <p className="text-[#617589] dark:text-slate-400 text-sm">
            Fintech Solutions
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <a
            key={idx}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
            href="#"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <p className="text-sm font-medium">{item.label}</p>
          </a>
        ))}
      </nav>
    </aside>
  );
}
