// src/pages/Dashboard.jsx
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            
            {/* Heading */}
            <div className="mb-8">
              <p className="text-[#111418] dark:text-white text-4xl font-black">
                Dashboard
              </p>
              <p className="text-[#617589] dark:text-slate-400">
                Billing Overview
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Active Subscriptions", "1,234"],
                ["Total Revenue", "₹8,45,670"],
                ["Wallet Balance", "₹1,12,300"],
                ["Past Due Subscriptions", "82"],
              ].map(([title, value], idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <p className="text-[#111418] dark:text-slate-300">{title}</p>
                  <p className="text-[#111418] dark:text-white text-3xl font-bold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="mt-8">
              <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">

                {/* Chart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold dark:text-white">
                      Revenue Overview
                    </p>
                    <p className="text-4xl font-bold dark:text-white">
                      ₹2,48,921
                    </p>

                    <div className="flex gap-2 items-center">
                      <p className="text-[#617589] text-sm">Last 30 days</p>
                      <div className="flex gap-1 text-green-600">
                        <span className="material-symbols-outlined text-base">
                          trending_up
                        </span>
                        <p className="text-sm font-medium">+12.5%</p>
                      </div>
                    </div>
                  </div>

                  {/* Chart duration buttons */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {["30D", "90D", "1Y", "All"].map((label, idx) => (
                      <button
                        key={idx}
                        className={`px-3 py-1 text-sm rounded-md ${
                          label === "90D"
                            ? "bg-primary text-white"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG CHART */}
                <div className="flex flex-col py-4 gap-8 min-h-[250px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="-3 0 478 150"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25V149H0V109Z"
                      fill="url(#paint0)"
                    />
                    <path
                      d="M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25"
                      stroke="#137fec"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="paint0" x1="236" y1="1" x2="236" y2="149">
                        <stop stopColor="#137fec" stopOpacity="0.2" />
                        <stop offset="1" stopColor="#137fec" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Week labels */}
                  <div className="flex justify-around text-xs font-bold text-[#617589]">
                    <p>Week 1</p>
                    <p>Week 2</p>
                    <p>Week 3</p>
                    <p>Week 4</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
