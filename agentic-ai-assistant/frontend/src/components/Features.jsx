import { Brain, Users, FileSearch, Lightbulb } from "lucide-react";

const features = [
  {
    icon: <Brain size={40} />,
    title: "Semantic Search (LangChain)",
    desc: "Query global research papers and topics semantically.",
  },
  {
    icon: <Users size={40} />,
    title: "Collaboration Discovery (CrewAI)",
    desc: "Identify experts and potential collaborators intelligently.",
  },
  {
    icon: <FileSearch size={40} />,
    title: "Grant Finder",
    desc: "Suggests funding opportunities based on research interests.",
  },
  {
    icon: <Lightbulb size={40} />,
    title: "Personalized Insights",
    desc: "AI analyzes your profile and suggests strategic matches.",
  },
];

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {features.map((f, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <div className="text-violet-600 mb-4">{f.icon}</div>
          <h3 className="font-semibold text-lg">{f.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
