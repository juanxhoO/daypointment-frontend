"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import { Separator } from "@radix-ui/react-separator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Appointments.module.css";
import { ChevronLeft, ChevronRight, Clock, Video, Globe } from "lucide-react";

// ---------------------------------------------------------------------------
// Static data describing the event type being booked.
// In a real app this would come from props / an API call (e.g. by slug).
// ---------------------------------------------------------------------------
const HOST = {
  name: "Sarah Jenkins",
  title: "Senior Product Consultant",
  avatarUrl: "/images/sarah-jenkins.jpg",
};

const EVENT = {
  name: "Strategic Growth Consultation",
  durationMinutes: 60,
  conferencingNote: "Web conferencing details provided upon confirmation.",
  description:
    "Deep dive into your current product strategy. We'll identify bottlenecks, review user journey maps, and outline a 90-day execution plan for your core KPIs. Please come prepared with your recent analytics dashboard access.",
};

const TIME_ZONE = "America/Los_Angeles";
const TIME_ZONE_LABEL = "Pacific Time";

// Available time slots per day-of-week. Replace with real availability data
// (e.g. fetched from your backend) keyed however makes sense for your API.
const SAMPLE_SLOTS = [
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:15",
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr.padStart(2, "0")}${period}`;
}

export default function Appointments() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { t } = useTranslation("confirm-new-email");

  const today = useMemo(() => startOfDay(new Date()), []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const confirm = async () => {
      // Hook point for loading existing availability / booking state from
      // the API once this page is wired up to real data.
    };

    confirm();
  }, [router, enqueueSnackbar, t]);

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleSelectDate = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);
    try {
      // Replace with your real booking request, e.g.:
      // await api.appointments.create({ date: selectedDate, time: selectedTime });
      enqueueSnackbar(t("appointment.confirmed", "Appointment booked"), {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("appointment.error", "Could not book appointment"), {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[280px_1fr_240px]">
        {/* Host / event info panel */}
        <div className="flex flex-col bg-slate-50 p-6">
          {/* <img
            src={HOST.avatarUrl}
            alt={HOST.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
          /> */}

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">{HOST.name}</p>
            <p className="text-sm text-gray-500">{HOST.title}</p>
          </div>

          <h1 className="mt-4 text-lg font-semibold text-blue-700">
            {EVENT.name}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{EVENT.durationMinutes} min</span>
          </div>

          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <Video className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>{EVENT.conferencingNote}</span>
          </div>

          <Separator
            orientation="horizontal"
            className="my-5 h-px w-full bg-gray-200"
          />

          <p className="text-sm leading-relaxed text-gray-700">
            {EVENT.description}
          </p>

          <div className="mt-auto pt-8 text-xs text-gray-400">
            POWERED BY{" "}
            <span className="font-semibold text-blue-600">Schedulr</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="border-t border-gray-100 p-6 md:border-l md:border-t-0">
          <h2 className="text-base font-semibold text-gray-900">
            Select a date &amp; time
          </h2>

          <div className={`${styles.datepicker} mt-4`}>
            <DatePicker
              selected={selectedDate}
              onChange={handleSelectDate}
              minDate={today}
              inline
              calendarStartDay={0}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
              }) => (
                <div className="mb-4 flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      aria-label="Previous month"
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={increaseMonth}
                      aria-label="Next month"
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
            <Globe className="h-4 w-4 text-gray-400" />
            <span>
              {TIME_ZONE_LABEL} (
              {new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: TIME_ZONE,
              })}
              )
            </span>
          </div>
        </div>

        {/* Time slots */}
        <div className="border-t border-gray-100 p-6 md:border-l md:border-t-0">
          <p className="text-sm font-semibold text-gray-900">
            Selected: {selectedDateLabel}
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
            {SAMPLE_SLOTS.map((time) => {
              const isActive = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  aria-pressed={isActive}
                  className={[
                    "w-full rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-blue-200 text-blue-700 hover:bg-blue-50",
                  ].join(" ")}
                >
                  {formatTime(time)}
                </button>
              );
            })}
          </div>

          {selectedTime && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
            >
              {isSubmitting ? "Booking..." : "Confirm appointment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
