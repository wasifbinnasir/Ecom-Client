export default function DashboardIndex() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-md border border-gray-100 p-8 mt-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">
        👋 Welcome Back
      </h1>
      <p className="text-base text-gray-600 leading-relaxed">
        Use the menu on the left to manage your{" "}
        <span className="font-semibold text-purple-700">store dashboard</span>.  
        Here you can track orders, manage products, and view reports.
      </p>
    </div>
  );
}
