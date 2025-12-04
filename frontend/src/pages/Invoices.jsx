import Sidebar from "../components/Sidebar";

export default function Invoices() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-grow">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            {/* Page Heading */}
            <header className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black tracking-tight">
                Invoices
              </h1>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Filters + New Invoice */}
              <div className="flex gap-2 w-full md:w-auto">

                {/* Filter Button */}
                <button className="p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>

                {/* Create Invoice */}
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded shadow hover:opacity-90">
                  <span className="material-symbols-outlined text-base">add</span>
                  Create Invoice
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="w-full">
              <div className="overflow-hidden rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Subscription
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Date Issued
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Date Due
                        </th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">

                      {/* Row 1 */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          INV-2023-0012
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          $1,250.00
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          Pro Plan - Acme Inc.
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          Jun 15, 2024
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          Jul 1, 2024
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 hover:text-primary">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium">INV-2023-0011</td>
                        <td className="px-6 py-4">$85.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                            Due
                          </span>
                        </td>
                        <td className="px-6 py-4">Basic Plan - Solo Dev</td>
                        <td className="px-6 py-4">Jun 12, 2024</td>
                        <td className="px-6 py-4">Jun 28, 2024</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 hover:text-primary">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium">INV-2023-0010</td>
                        <td className="px-6 py-4">$1,250.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            Paid
                          </span>
                        </td>
                        <td className="px-6 py-4">Pro Plan - Innovate LLC</td>
                        <td className="px-6 py-4">May 15, 2024</td>
                        <td className="px-6 py-4">Jun 1, 2024</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 hover:text-primary">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>

                      {/* Row 4 */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium">INV-2023-0009</td>
                        <td className="px-6 py-4">$500.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                            Failed
                          </span>
                        </td>
                        <td className="px-6 py-4">Growth Plan - Tech Solutions</td>
                        <td className="px-6 py-4">May 10, 2024</td>
                        <td className="px-6 py-4">May 25, 2024</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 hover:text-primary">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <nav className="flex items-center justify-center p-4 gap-2">
              <button className="flex size-10 items-center justify-center text-gray-500 hover:text-primary">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <span className="flex size-10 items-center justify-center bg-primary text-white rounded-full font-bold">
                1
              </span>

              <span className="flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary/20 rounded-full cursor-pointer">
                2
              </span>

              <span className="text-gray-500">...</span>

              <span className="flex size-10 items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary/20 rounded-full cursor-pointer">
                10
              </span>

              <button className="flex size-10 items-center justify-center text-gray-500 hover:text-primary">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>

          </div>
        </main>
      </div>
    </div>
  );
}
