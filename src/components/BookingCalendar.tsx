"use client";
import { useState, useEffect, useMemo } from "react";

// Slots can be either strings or objects depending on GHL calendar type
type Slot = string | { startTime: string; endTime: string };

interface SlotsData {
  [date: string]: {
    slots: Slot[];
  };
}

// Helper to extract start time from slot (handles both formats)
function getSlotStartTime(slot: Slot): string {
  return typeof slot === 'string' ? slot : slot.startTime;
}

// Helper to calculate end time (add slot duration)
function getSlotEndTime(slot: Slot, durationMins: number = 30): string {
  const startTime = getSlotStartTime(slot);
  if (typeof slot !== 'string' && slot.endTime) {
    return slot.endTime;
  }
  // Calculate end time by adding duration
  const start = new Date(startTime);
  start.setMinutes(start.getMinutes() + durationMins);
  return start.toISOString();
}

interface BookingCalendarProps {
  calendarId?: string;
  timezone?: string;
  services?: { name: string; duration: number }[];
}

export default function BookingCalendar({
  calendarId,
  timezone = "America/Los_Angeles",
  services = [{ name: "Free Consultation", duration: 30 }],
}: BookingCalendarProps) {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<SlotsData>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedService, setSelectedService] = useState(services[0]?.name || "");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    tcpaConsent: false,
  });

  // Fetch slots for current month view
  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setError(null);

      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

      const params = new URLSearchParams({
        startDate: start.getTime().toString(),
        endDate: end.getTime().toString(),
        timezone,
        ...(calendarId && { calendarId }),
      });

      try {
        const res = await fetch(`/api/booking/slots?${params}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load available times");
        }

        setSlots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load slots");
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [calendarId, timezone, currentMonth]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];

    // Add padding for days before the 1st
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  // Check if a date has available slots
  const hasSlots = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return slots[dateStr]?.slots?.length > 0;
  };

  // Format time for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get slot duration from selected service
  const getSlotDuration = () => {
    const service = services.find(s => s.name === selectedService);
    return service?.duration || 30;
  };

  // Handle booking submission
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setLoading(true);
    setError(null);

    try {
      const startTime = getSlotStartTime(selectedSlot);
      const endTime = getSlotEndTime(selectedSlot, getSlotDuration());

      const res = await fetch("/api/booking/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          startTime,
          endTime,
          service: selectedService,
          address: formData.address,
          notes: formData.notes,
          tcpaConsent: formData.tcpaConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      setStep(3); // Success step
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">
          {step === 1 && "Select Date & Time"}
          {step === 2 && "Your Information"}
          {step === 3 && "Booking Confirmed!"}
        </h2>
        {step < 3 && (
          <p className="text-blue-100 text-sm mt-1">Step {step} of 2</p>
        )}
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Date & Time Selection */}
        {step === 1 && (
          <div>
            {/* Service Selection */}
            {services.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.duration} min)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                disabled={
                  currentMonth.getMonth() === today.getMonth() &&
                  currentMonth.getFullYear() === today.getFullYear()
                }
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {slotsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, i) => {
                    if (!date) {
                      return <div key={`empty-${i}`} className="h-10" />;
                    }

                    const dateStr = date.toISOString().split("T")[0];
                    const isPast = date < today;
                    const hasAvailability = hasSlots(date);
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot(null);
                        }}
                        disabled={isPast || !hasAvailability}
                        className={`
                          h-10 rounded-lg text-sm font-medium transition-all
                          ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                          ${!isPast && !hasAvailability ? "text-gray-400 cursor-not-allowed" : ""}
                          ${!isPast && hasAvailability && !isSelected ? "text-gray-900 hover:bg-blue-50 hover:text-blue-600" : ""}
                          ${isSelected ? "bg-blue-600 text-white" : ""}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time Slots */}
            {selectedDate && slots[selectedDate]?.slots && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Available times for{" "}
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots[selectedDate].slots.map((slot) => {
                    const slotTime = getSlotStartTime(slot);
                    const isSelected = selectedSlot && getSlotStartTime(selectedSlot) === slotTime;
                    return (
                      <button
                        key={slotTime}
                        onClick={() => setSelectedSlot(slot)}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          }
                        `}
                      >
                        {formatTime(slotTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!selectedSlot}
              className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <form onSubmit={handleBook}>
            {/* Selected Time Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">{selectedService}</span>
                <br />
                {selectedDate &&
                  new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                at {selectedSlot && formatTime(getSlotStartTime(selectedSlot))}
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Change
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 555-5555"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Anything you'd like us to know..."
                />
              </div>

              {/* TCPA Consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="tcpa"
                  required
                  checked={formData.tcpaConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, tcpaConsent: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="tcpa" className="text-xs text-gray-600">
                  I agree to receive SMS and email communications regarding my appointment.
                  Message and data rates may apply. Reply STOP to unsubscribe.
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re All Set!</h3>
            <p className="text-gray-600 mb-6">
              Your appointment has been confirmed. You&apos;ll receive a confirmation email and text shortly.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{selectedService}</span>
                <br />
                {selectedDate &&
                  new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                at {selectedSlot && formatTime(getSlotStartTime(selectedSlot))}
              </p>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setSelectedDate(null);
                setSelectedSlot(null);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  address: "",
                  notes: "",
                  tcpaConsent: false,
                });
              }}
              className="mt-6 text-blue-600 hover:underline"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
