"use client";

import { useState } from "react";
import {
  CalendarDays,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/search-bar";
// ---------------------------------------------------------------------------
// Types & seed data
// ---------------------------------------------------------------------------
type DayRow = {
  id: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

const INITIAL_DAYS: DayRow[] = [
  {
    id: "sun",
    label: "Sunday",
    enabled: false,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "mon",
    label: "Monday",
    enabled: true,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "tue",
    label: "Tuesday",
    enabled: true,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "wed",
    label: "Wednesday",
    enabled: true,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "thu",
    label: "Thursday",
    enabled: true,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "fri",
    label: "Friday",
    enabled: true,
    start: "09:00 AM",
    end: "05:00 PM",
  },
  {
    id: "sat",
    label: "Saturday",
    enabled: false,
    start: "09:00 AM",
    end: "05:00 PM",
  },
];





// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Events() {
  const [days, setDays] = useState<DayRow[]>(INITIAL_DAYS);
  const [beforeEvent, setBeforeEvent] = useState("15 minutes");
  const [afterEvent, setAfterEvent] = useState("10 minutes");
  const [minNotice, setMinNotice] = useState("4 hours");
  const [maxAdvance, setMaxAdvance] = useState("60 days");
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateDay = (id: string, patch: Partial<DayRow>) => {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const handleCopyToAll = (sourceId: string) => {
    setDays((prev) => {
      const source = prev.find((d) => d.id === sourceId);
      if (!source) return prev;
      return prev.map((d) =>
        d.enabled ? { ...d, start: source.start, end: source.end } : d
      );
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Replace with a real persistence call, e.g.:
    // await api.availability.update({ days, beforeEvent, afterEvent, minNotice, maxAdvance });
    window.setTimeout(() => {
      setIsSaving(false);
      setToast("Schedule updated successfully");
      window.setTimeout(() => setToast(null), 3000);
    }, 400);
  };

  const handleDiscard = () => {
    setDays(INITIAL_DAYS);
    setBeforeEvent("15 minutes");
    setAfterEvent("10 minutes");
    setMinNotice("4 hours");
    setMaxAdvance("60 days");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-blue-700">Events</h1>
          <span className="h-5 w-px bg-gray-300" />
          <p className="text-base text-gray-500">Event Management</p>
        </div>
      </header>

      {/* Page body */}
      <main className="px-8 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mt-1 text-gray-500">
              Define when you are available for bookings across the week.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-2">
          {/* Default Schedule card */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <SearchBar
                items={[]}
                searchKeys={["title", "description"]}
                placeholder="Search events"
              />
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                <PlusCircle className="h-4 w-4" />
                Create New Event
              </button>
            </div>


            <div className="flex p-4 gap-4 w-full">
              <Card
                title={"Test Title"} subtitle={"Test Subtitle"} actions={"Test Actions"} footer={"Test Footer"}>
                <p>
                  dssd
                </p>
              </Card>

              <Card>
                <div className="flex flex-col items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4 text-blue-700" />
                  <p>
                    Create New Event
                  </p>
                </div>

              </Card>
            </div>

          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
