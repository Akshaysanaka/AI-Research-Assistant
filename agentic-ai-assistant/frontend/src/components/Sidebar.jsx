const tabs = ["Profile", "Collaborators", "Grants", "Insights", "Settings"];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white shadow-lg p-6">
      <h2 className="text-xl font-bold text-violet-700 mb-6">Dashboard</h2>
      <ul>
        {tabs.map((t) => (
          <li
            key={t}
            onClick={() => setActiveTab(t)}
            className={`p-3 rounded-lg cursor-pointer mb-2 ${
              activeTab === t ? "bg-violet-100 text-violet-700" : "hover:bg-gray-100"
            }`}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
