"use client";

import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_id: "",
    preferred_date: "",
    time_slot: "",
    notes: "",
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${API_BASE}/api/services?active=true`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        setServices(data.services ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canGoNextStep1 =
    form.name.trim() && form.email.trim() && form.phone.trim();
  const canGoNextStep2 =
    form.service_id && form.preferred_date && form.preferred_date.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/public/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit booking");
      }
      setSuccess(
        "Your appointment request has been submitted successfully! We will confirm your exact time by email."
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        service_id: "",
        preferred_date: "",
        time_slot: "",
        notes: "",
      });
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    { number: 1, title: "Patient Details" },
    { number: 2, title: "Service & Date" },
    { number: 3, title: "Review" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Schedule your visit in just a few simple steps
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-600 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                      step >= s.number
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {s.number}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      step >= s.number ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      step > s.number ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    style={{ marginBottom: "32px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Patient Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tell us about yourself
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    We'll use this information to contact you about your
                    appointment
                  </p>
                </div>

                <div >
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2 ">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      autoComplete="tel"
                      placeholder="+92 312 3456789"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service & Date */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Select service and date
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Choose the service you need and your preferred appointment
                    time
                  </p>
                </div>

                <div>
                  <Label htmlFor="service">Service *</Label>
                  <select
                    id="service"
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm"
                    style={{ backgroundColor: 'white', color: '#111827' }}
                    value={form.service_id}
                    onChange={handleChange("service_id")}
                    disabled={loadingServices}
                    required
                  >
                    <option value="">
                      {loadingServices
                        ? "Loading services..."
                        : "Select a service"}
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.price
                          ? ` - ₹${s.price.toFixed ? s.price.toFixed(0) : s.price}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={form.preferred_date}
                      onChange={handleChange("preferred_date")}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time (Optional)</Label>
                    <Input
                      id="time"
                      placeholder="e.g. 10:30 AM"
                      value={form.time_slot}
                      onChange={handleChange("time_slot")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent resize-none transition-colors shadow-sm"
                    style={{ backgroundColor: 'white', color: '#111827' }}
                    placeholder="Any special requirements or questions..."
                    value={form.notes}
                    onChange={handleChange("notes")}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Review your appointment
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Please verify your information before submitting
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Patient Info */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900 flex items-center">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Patient Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-900">
                          {form.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {form.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">
                          {form.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900 flex items-center">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Appointment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-900">
                          {services.find(
                            (s) => String(s.id) === String(form.service_id)
                          )?.name || "Service"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(form.preferred_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {form.time_slot && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium text-gray-900">
                            {form.time_slot}
                          </span>
                        </div>
                      )}
                      {form.notes && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-gray-600 block mb-1">Notes:</span>
                          <p className="text-gray-900">{form.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-blue-800">
                          By submitting, you agree to be contacted by our team
                          to confirm your appointment time and discuss any
                          additional details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  disabled={
                    (step === 1 && !canGoNextStep1) ||
                    (step === 2 && !canGoNextStep2)
                  }
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <svg
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Appointment
                      <svg
                        className="h-4 w-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="tel:+1234567890"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Call us
            </a>{" "}
            or{" "}
            <a
              href="mailto:info@brightsmile.com"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              send an email
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}