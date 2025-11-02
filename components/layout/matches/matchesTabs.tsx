"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Calendar, ChevronDown, Trophy } from "lucide-react";
import LiveMatchesTab from "@/components/layout/matches/tabs/LiveMatchTab";
import ScheduleMatchesTab from "@/components/layout/matches/tabs/ScheduleMatchTab";
import UpcomingMatchesTab from "./tabs/UpcomingMatchTab";
import TableTab from "./tabs/TableTab";

const tabs = [
  { label: "Live", icon: <Activity size={16} />, endpoint: "/api/matches/live" },
  { label: "Today", icon: <Calendar size={16} />, endpoint: "/api/matches/schedule" },
  { label: "Upcoming", icon: <ChevronDown size={16} />, endpoint: "/api/matches/upcoming" },
  { label: "Table", icon: <Trophy size={16} />, endpoint: "/api/matches/table" },
];

export default function MatchesTabs() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  return (
    <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4">
      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`relative flex items-center gap-1 pb-2 text-sm font-medium transition-all ${
              activeTab === t.label
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
            {activeTab === t.label && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "Live" && <LiveMatchesTab />}
          {activeTab === "Today" && <ScheduleMatchesTab />}
          {activeTab === "Upcoming" && <UpcomingMatchesTab />}
          {activeTab === "Table" && <TableTab />}
          

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
