import Sidebar from "../components/Sidebar";

export default function InvoiceDetail() {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Top Section */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <h1 className="text-gray-900 dark:text-white text-4xl font-black tracking-tight">
                Invoice Details
              </h1>
              <p className="text-gray-500 dark:text-gray-400">Invoice #INV-2023-0012</p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined text-sm">download</span>
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90">
                <span className="material-symbols-outlined text-sm">print</span>
                Print
              </button>
            </div>
          </div>

          {/* Invoice Header Card */}
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <div className="flex justify-between flex-wrap gap-6">
              
              {/* Company Info */}
              <div>
                <h2 className="text-xl font-bold dark:text-white">PayHive Technologies</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sector 62, Noida, Uttar Pradesh  
                  <br /> GSTIN: 29ABCDE1234F1Z5
                </p>
              </div>

              {/* Invoice Summary */}
              <div className="text-right">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Invoice Number</p>
                <p className="text-lg font-bold dark:text-white">INV-2023-0012</p>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Issued On</p>
                <p className="text-lg font-medium dark:text-gray-200">June 15, 2024</p>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Due Date</p>
                <p className="text-lg font-medium dark:text-gray-200">July 1, 2024</p>
              </div>
            </div>
          </div>

          {/* BILL TO SECTION */}
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Bill To</h3>

            <p className="text-gray-900 dark:text-gray-200 font-medium text-lg">
              Liam Johnson
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              liam.johnson@email.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Bangalore, Karnataka — India
            </p>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800 p-6 mb-10">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Invoice Items</h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Unit Price</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">
                      Pro Tier Subscription — Monthly Billing
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">1</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">$1,250.00</td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-200 font-medium">
                      $1,250.00
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-medium">
                      Additional SMS Usage
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">420</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-400">$0.05</td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-200 font-medium">
                      $21.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">$1,271.00</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                  <span className="font-medium text-gray-900 dark:text-gray-200">$228.78</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-semibold">Total</span>
                  <span className="text-gray-900 dark:text-white font-bold">$1,499.78</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Payment Status</h3>

            <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-sm font-medium">
              Payment Succeeded
            </span>

            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Paid on <span className="font-medium text-gray-900 dark:text-gray-200">June 16, 2024</span>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
