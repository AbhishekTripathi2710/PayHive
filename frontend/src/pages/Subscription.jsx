import Sidebar from "../components/Sidebar";

export default function Subscriptions() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">

            {/* Page Heading */}
            <div className="mb-8">
              <p className="text-[#111418] dark:text-white text-4xl font-black">
                Subscriptions
              </p>
              <p className="text-[#617589] dark:text-slate-400">
                Manage and view all customer subscriptions.
              </p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by ID, customer name..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-background-dark border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border bg-white dark:bg-background-dark text-sm text-gray-700 dark:text-gray-300">
                  Status
                </button>
                <button className="px-4 py-2 rounded-lg border bg-white dark:bg-background-dark text-sm text-gray-700 dark:text-gray-300">
                  Plan
                </button>
              </div>

              <button className="ml-auto px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Subscription
              </button>
            </div>

            {/* Subscriptions Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Plan Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Period End
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

                    {/* Row 1 */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        sub_jJ2k3L4m5N6o
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Pro Tier <br />
                        <span className="text-xs text-gray-400">liam@example.com</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Oct 25, 2024
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        sub_aB1c2D3e4F5g
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Enterprise <br />
                        <span className="text-xs text-gray-400">olivia@corp.com</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                          Trialing
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Sep 30, 2024
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        sub_xY9z8W7v6U5t
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Basic Plan <br />
                        <span className="text-xs text-gray-400">noah@web.dev</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                          Past Due
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Sep 15, 2024
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        sub_pQ7r6S5t4U3v
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Pro Tier <br />
                        <span className="text-xs text-gray-400">emma@startup.io</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Oct 22, 2024
                      </td>
                    </tr>

                    {/* Row 5 */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        sub_kL8m7N6o5P4q
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Basic Plan <br />
                        <span className="text-xs text-gray-400">sophia@mail.net</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                          Canceled
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        Aug 31, 2024
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-6 gap-3">
              <button className="text-gray-600 hover:text-primary">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                1
              </span>

              <button className="text-gray-600 hover:text-primary">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
