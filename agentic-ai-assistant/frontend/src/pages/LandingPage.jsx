import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Features from "../components/Features";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center text-center bg-gradient-to-br from-blue-50 to-violet-100">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-24"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-violet-700">
          Empowering Faculty Research through AI Collaboration
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover collaborators, explore grants, and accelerate innovation
          using LangChain and CrewAI.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700"
          >
            Get Started
          </button>
          <a href="#features" className="border border-violet-600 px-6 py-3 rounded-xl text-violet-600 hover:bg-violet-100">
            Learn More
          </a>
        </div>
      </motion.div>

      <section id="features" className="mt-32 w-full max-w-5xl">
        <Features />
      </section>
    </div>
  );
}
