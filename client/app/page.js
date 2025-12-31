"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");
        
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://dentist-serverless-tw1a.vercel.app";
                
        const res = await fetch(`${baseUrl}/api/services?active=true`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched services:", data);
        
        if (data.success && data.services) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-blue-700">
                  Modern Dental Care • Patient First
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your smile deserves the{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  best care
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Experience gentle, comprehensive dental care in a modern,
                comfortable environment. From routine checkups to advanced
                treatments, we're here for your smile.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/book"
                  className="group inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Book Appointment
                  <svg
                    className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
                </a>
                <a
                  href="#services"
                  className="group inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-md hover:bg-gray-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  View Services
                  <svg
                    className="ml-2 h-5 w-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="group space-y-1 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-center text-blue-600">
                    <svg
                      className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      Mon - Sat
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 pl-7">
                    9:00 AM - 8:00 PM
                  </p>
                </div>
                <div className="group space-y-1 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-center text-blue-600">
                    <svg
                      className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">
                      Emergency
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 pl-7">
                    Same-day slots
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Feature Card */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Why Choose Us
                  </h3>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Our experienced team combines cutting-edge technology with
                  gentle care. We focus on prevention and education for
                  long-term dental health.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                      text: "Digital X-rays & Advanced Imaging",
                    },
                    {
                      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                      text: "Gentle, Pain-Free Procedures",
                    },
                    {
                      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                      text: "Transparent Pricing & Plans",
                    },
                  ].map((item, i) => (
                    <div key={i} className="group/item flex items-start space-x-3 rounded-lg p-2 -ml-2 hover:bg-blue-50 transition-colors duration-200">
                      <svg
                        className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                      <span className="text-sm text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 mb-4">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Our Services
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Dental Care
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Each service is designed with your comfort in mind and delivered with transparent pricing.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading services...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-8 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-semibold mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-16 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No services available
                  </h3>
                  <p className="text-sm text-gray-500">
                    Services will be displayed here once configured in the admin dashboard.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-gray-100 group-hover:border-blue-100 pt-4 transition-colors duration-300">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                          Price
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                          Rs{service.price?.toFixed ? service.price.toFixed(0) : service.price}
                        </p>
                      </div>
                      {service.duration_minutes && (
                        <div className="flex items-center space-x-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 px-4 py-2 group-hover:from-blue-100 group-hover:to-blue-50 transition-all duration-300">
                          <svg
                            className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                            {service.duration_minutes}m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="mt-16 text-center">
              <a
                href="/book"
                className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:-translate-y-1"
              >
                Schedule Your Visit
                <svg
                  className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300"
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
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
              <div className="text-sm text-blue-100 font-medium uppercase tracking-wide">Years Experience</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-sm text-blue-100 font-medium uppercase tracking-wide">Happy Patients</div>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">4.9/5</div>
              <div className="text-sm text-blue-100 font-medium uppercase tracking-wide">Patient Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}