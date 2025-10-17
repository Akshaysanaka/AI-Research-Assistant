import Sidebar from "../components/Sidebar";
import ProfileSummary from "../components/ProfileSummary";
import Collaborators from "../components/Collaborators";
import Grants from "../components/Grants";
import ChatAssistant from "../components/ChatAssistant";
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 bg-gray-50 relative">
        {activeTab === "Profile" && <ProfileSummary />}
        {activeTab === "Collaborators" && <Collaborators />}
        {activeTab === "Grants" && <Grants />}
        <ChatAssistant />
      </main>
    </div>
  );
}
