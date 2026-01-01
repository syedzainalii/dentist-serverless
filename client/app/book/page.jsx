"use client";

import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://dentist-serverless-tw1a.vercel.app";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", service_id: "",
    preferred_date: "", time_slot: "", notes: "",
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

  const canGoNextStep1 = form.name.trim() && form.email.trim() && form.phone.trim();
  const canGoNextStep2 = form.service_id && form.preferred_date && form.preferred_date.length > 0;

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
      setSuccess("Your appointment request has been submitted successfully! We will confirm your exact time by email.");
      setForm({ name: "", email: "", phone: "", service_id: "", preferred_date: "", time_slot: "", notes: "" });
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    { num: 1, title: "Patient Details", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { num: 2, title: "Service & Date", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { num: 3, title: "Review", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-2 shadow-sm mb-4">
            <span className="h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-700">Online Booking</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r text-blue-600 bg-clip-text text-transparent sm:text-5xl">
            Book Your Appointment
          </h1>
          <p className="mt-4 text-lg text-gray-600">Schedule your visit in just a few simple steps</p>
        </div>

        {success && (
          <div className="mb-8 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900 mb-1">Success!</h3>
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-lg">
            <div className="flex items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1 group">
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 font-semibold transition-all duration-500 ${
                      step >= s.num ? "border-blue-600 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg scale-110" : "border-gray-300 bg-white text-gray-400 group-hover:border-blue-300 group-hover:scale-105"
                    }`}>
                    {step > s.num ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                      </svg>
                    )}
                    {step === s.num && <span className="absolute -inset-1 rounded-2xl bg-blue-400 opacity-20 animate-ping"></span>}
                  </div>
                  <span className={`mt-3 text-xs font-semibold transition-colors duration-300 ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="relative flex-1" style={{ marginBottom: "48px" }}>
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div className={`h-1 rounded-full transition-all duration-500 ${step > s.num ? "bg-gradient-to-r from-blue-600 to-blue-500 w-full" : "w-0"}`}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-500">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
                  </div>
                  <p className="text-gray-600">We'll use this information to contact you about your appointment</p>
                </div>
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name *</Label>
                  <Input id="name" autoComplete="name" placeholder="John Doe" value={form.name} onChange={handleChange("name")} className="mt-2 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300" required />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address *</Label>
                    <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={handleChange("email")} className="mt-2 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number *</Label>
                    <Input id="phone" autoComplete="tel" placeholder="+92 312 3456789" value={form.phone} onChange={handleChange("phone")} className="mt-2 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300" required />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Select service and date</h2>
                  </div>
                  <p className="text-gray-600">Choose the service you need and your preferred appointment time</p>
                </div>
                <div>
                  <Label htmlFor="service" className="text-gray-700 font-semibold">Service *</Label>
                  <select id="service" className="mt-2 flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-blue-300 shadow-sm" value={form.service_id} onChange={handleChange("service_id")} disabled={loadingServices} required>
                    <option value="">{loadingServices ? "Loading services..." : "Select a service"}</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}{s.price ? ` - ₹${s.price.toFixed ? s.price.toFixed(0) : s.price}` : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="date" className="text-gray-700 font-semibold">Preferred Date *</Label>
                    <Input id="date" type="date" value={form.preferred_date} onChange={handleChange("preferred_date")} min={new Date().toISOString().split("T")[0]} className="mt-2 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300" required />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-gray-700 font-semibold">Preferred Time (Optional)</Label>
                    <Input id="time" placeholder="e.g. 10:30 AM" value={form.time_slot} onChange={handleChange("time_slot")} className="mt-2 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover:border-blue-300" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-700 font-semibold">Additional Notes (Optional)</Label>
                  <textarea id="notes" className="mt-2 flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 hover:border-blue-300 shadow-sm" placeholder="Any special requirements or questions..." value={form.notes} onChange={handleChange("notes")} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Review your appointment</h2>
                  </div>
                  <p className="text-gray-600">Please verify your information before submitting</p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 mr-3">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Patient Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Name:</span>
                        <span className="text-sm font-semibold text-gray-900">{form.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Email:</span>
                        <span className="text-sm font-semibold text-gray-900">{form.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 font-medium">Phone:</span>
                        <span className="text-sm font-semibold text-gray-900">{form.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="mb-4 text-base font-bold text-gray-900 flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 mr-3">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Appointment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Service:</span>
                        <span className="text-sm font-semibold text-gray-900">{services.find((s) => String(s.id) === String(form.service_id))?.name || "Service"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">Date:</span>
                        <span className="text-sm font-semibold text-gray-900">{new Date(form.preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {form.time_slot && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-600 font-medium">Time:</span>
                          <span className="text-sm font-semibold text-gray-900">{form.time_slot}</span>
                        </div>
                      )}
                      {form.notes && (
                        <div className="pt-2">
                          <span className="text-sm text-gray-600 font-medium block mb-2">Notes:</span>
                          <p className="text-sm text-gray-900 bg-white rounded-lg p-3">{form.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
                    <div className="flex items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-blue-900 leading-relaxed">By submitting, you agree to be contacted by our team to confirm your appointment time and discuss any additional details.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t-2 border-gray-200 pt-8">
              <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="group h-12 px-6 rounded-xl border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:-translate-x-1">
                <svg className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
              {step < 3 ? (
                <Button type="button" disabled={(step === 1 && !canGoNextStep1) || (step === 2 && !canGoNextStep2)} onClick={() => setStep((s) => Math.min(3, s + 1))} className="group h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-x-1">
                  Continue
                  <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="group h-12 px-8 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Appointment
                      <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">Need help? <a href="tel:+1234567890" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">Call us</a> or <a href="mailto:info@brightsmile.com" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">send an email</a></p>
        </div>
      </div>
    </div>
  );
}