"use client";

import { useState } from "react";
import {
  Bell,
  HelpCircle,
  CalendarDays,
  PlusCircle,
  Trash2,
  Plus,
  Copy,
  Timer,
  BellRing,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

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
  { id: "sun", label: "Sunday", enabled: false, start: "09:00 AM", end: "05:00 PM" },
  { id: "mon", label: "Monday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
  { id: "tue", label: "Tuesday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
  { id: "wed", label: "Wednesday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
  { id: "thu", label: "Thursday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
  { id: "fri", label: "Friday", enabled: true, start: "09:00 AM", end: "05:00 PM" },
  { id: "sat", label: "Saturday", enabled: false, start: "09:00 AM", end: "05:00 PM" },
];

const BEFORE_EVENT_OPTIONS = ["None", "5 minutes", "10 minutes", "15 minutes", "30 minutes"];
const AFTER_EVENT_OPTIONS = ["None", "5 minutes", "10 minutes", "15 minutes", "30 minutes"];
const MIN_NOTICE_OPTIONS = ["1 hour", "2 hours", "4 hours", "12 hours", "24 hours"];
const MAX_ADVANCE_OPTIONS = ["30 days", "60 days", "90 days", "6 months"];

// ---------------------------------------------------------------------------
// Small reusable bits
// ---------------------------------------------------------------------------
function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-blue-600" : "bg-gray-200",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        ].join(" ")}
      >
        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.5} />}
      </span>
    </button>
  );
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-blue-50/60 px-3.5 py-2.5 pr-9 text-sm text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}

function TimeInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="text"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="w-[108px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Availability() {
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
          <h1 className="text-xl font-bold text-blue-700">Availability</h1>
          <span className="h-5 w-px bg-gray-300" />
          <p className="text-base text-gray-500">Working Hours Schedule</p>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Notifications" className="text-gray-500 hover:text-gray-700">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Help" className="text-gray-500 hover:text-gray-700">
            <HelpCircle className="h-5 w-5" />
          </button>
          <img
            src="/images/avatar.jpg"
            alt="Account"
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </header>

      {/* Page body */}
      <main className="px-8 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Weekly Hours</h2>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Default Schedule card */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-700" />
                <h3 className="text-lg font-bold text-gray-900">Default Schedule</h3>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                <PlusCircle className="h-4 w-4" />
                Add Date Overrides
              </button>
            </div>

            <div>
              {days.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center gap-4 border-b border-gray-100 px-6 py-5 last:border-b-0"
                >
                  <Toggle
                    checked={day.enabled}
                    ariaLabel={`Toggle ${day.label}`}
                    onChange={(next) => updateDay(day.id, { enabled: next })}
                  />

                  <span className="w-28 text-sm font-semibold uppercase tracking-wide text-gray-800">
                    {day.label}
                  </span>

                  {day.enabled ? (
                    <>
                      <TimeInput
                        value={day.start}
                        ariaLabel={`${day.label} start time`}
                        onChange={(v) => updateDay(day.id, { start: v })}
                      />
                      <span className="text-gray-400">—</span>
                      <TimeInput
                        value={day.end}
                        ariaLabel={`${day.label} end time`}
                        onChange={(v) => updateDay(day.id, { end: v })}
                      />

                      <button
                        type="button"
                        aria-label={`Remove ${day.label} hours`}
                        onClick={() => updateDay(day.id, { enabled: false })}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Add another time range for ${day.label}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        aria-label={`Copy ${day.label} hours to all active days`}
                        onClick={() => handleCopyToAll(day.id)}
                        className="ml-auto text-gray-300 hover:text-gray-500"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="italic text-gray-400">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-2 flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-700" />
                <h3 className="text-lg font-bold text-gray-900">Buffer Time</h3>
              </div>
              <p className="mb-5 text-sm text-gray-500">
                Prevent back-to-back meetings by adding time before or after each event.
              </p>
              <div className="flex flex-col gap-4">
                <Dropdown
                  label="Before Event"
                  value={beforeEvent}
                  options={BEFORE_EVENT_OPTIONS}
                  onChange={setBeforeEvent}
                />
                <Dropdown
                  label="After Event"
                  value={afterEvent}
                  options={AFTER_EVENT_OPTIONS}
                  onChange={setAfterEvent}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-2 flex items-center gap-2">
                <BellRing className="h-5 w-5 text-blue-700" />
                <h3 className="text-lg font-bold text-gray-900">Scheduling Notice</h3>
              </div>
              <p className="mb-5 text-sm text-gray-500">
                Set a minimum notice period to avoid last-minute surprises.
              </p>
              <div className="flex flex-col gap-4">
                <Dropdown
                  label="Minimum Notice"
                  value={minNotice}
                  options={MIN_NOTICE_OPTIONS}
                  onChange={setMinNotice}
                />
                <Dropdown
                  label="Maximum Advance Booking"
                  value={maxAdvance}
                  options={MAX_ADVANCE_OPTIONS}
                  onChange={setMaxAdvance}
                />
              </div>
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