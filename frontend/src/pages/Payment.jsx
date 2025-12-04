import Sidebar from "../components/Sidebar";

export default function Payments() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex h-full">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
          <div className="max-w-7xl mx-auto flex flex-col w-full">

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black tracking-tight">
                Payments
              </h1>

              <button className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-lg h-11 px-6 text-white text-sm font-bold tracking-wide gradient-button shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">
                Export Data
              </button>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 py-5">

              {/* Search Input */}
              <div className="lg:col-span-2">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex items-center w-full bg-white dark:bg-gray-800/50 shadow-sm rounded-lg h-full px-4">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                      search
                    </span>
                    <input
                      className="form-input flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2"
                      placeholder="Search payments..."
                    />
                  </div>
                </label>
              </div>

              {/* Filters */}
              <div className="flex gap-3 items-center lg:col-span-3">

                <button className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm px-4">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">Last 30 Days</p>
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                    expand_more
                  </span>
                </button>

                <button className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm px-4">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">Status</p>
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                    expand_more
                  </span>
                </button>

                <button className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm px-4">
                  <p className="text-gray-900 dark:text-white text-sm font-medium">Gateway</p>
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                    expand_more
                  </span>
                </button>

              </div>
            </div>

            {/* Table */}
            <div className="px-4 py-3">
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-lg dark:shadow-black/10">

                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Gateway
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

                    {/* Row */}
                    {[
                      {
                        id: "pi_3L...789",
                        user: "liam.johnson@email.com",
                        amount: "$1,250.00",
                        gateway: "Stripe",
                        status: "Succeeded",
                        date: "Oct 24, 2023",
                        statusColor: "green",
                      },
                      {
                        id: "pi_3L...790",
                        user: "olivia.smith@email.com",
                        amount: "$85.50",
                        gateway: "Wallet",
                        status: "Succeeded",
                        date: "Oct 23, 2023",
                        statusColor: "green",
                      },
                      {
                        id: "pi_3L...791",
                        user: "noah.williams@email.com",
                        amount: "$320.00",
                        gateway: "Stripe",
                        status: "Failed",
                        date: "Oct 22, 2023",
                        statusColor: "red",
                      },
                    ].map((p, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {p.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {p.user}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {p.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {p.gateway}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                              p.statusColor === "green"
                                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                p.statusColor === "green"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></span>
                            {p.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {p.date}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center p-4">
              <nav className="flex items-center gap-1">

                <button className="flex size-10 items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>

                <span className="flex size-10 items-center justify-center text-white bg-primary/90 rounded-full font-bold">
                  1
                </span>

                <span className="flex size-10 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full hover:text-white cursor-pointer">
                  2
                </span>

                <span className="flex size-10 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full hover:text-white cursor-pointer">
                  3
                </span>

                <span className="text-gray-400 dark:text-gray-600">...</span>

                <span className="flex size-10 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full hover:text-white cursor-pointer">
                  10
                </span>

                <button className="flex size-10 items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>

              </nav>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
