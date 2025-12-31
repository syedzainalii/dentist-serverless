"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function load() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, chartsRes, bookingsRes, servicesRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/dashboard/summary`, { headers }),
            fetch(`${API_BASE}/api/dashboard/charts?range=30d`, { headers }),
            fetch(`${API_BASE}/api/bookings`, { headers }),
            fetch(`${API_BASE}/api/services`, { headers }), // FIXED: Removed ?active=false
          ]);

        if (summaryRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        const summaryData = await summaryRes.json();
        const chartsData = await chartsRes.json();
        const bookingsData = await bookingsRes.json();
        const servicesData = await servicesRes.json();

        if (!summaryData.success) throw new Error();

        setSummary(summaryData.summary);
        setCharts(chartsData.charts ?? null);
        setBookings(bookingsData.bookings ?? []);
        setServices(servicesData.services ?? []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleStatusChange(id, status, time_slot) {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, time_slot }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to update booking");
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? data.booking : b))
    );
  }

  async function handleCreateService(e) {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...newService,
        price: parseFloat(newService.price || "0"),
        duration_minutes: newService.duration_minutes
          ? parseInt(newService.duration_minutes, 10)
          : null,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to create service");
      return;
    }

    setServices((prev) => [...prev, data.service]);
    setNewService({
      name: "",
      description: "",
      price: "",
      duration_minutes: "",
    });
  }

  async function handleToggleService(serviceId, currentStatus) {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/services/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_active: !currentStatus,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to update service");
      return;
    }

    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? data.service : s))
    );
  }

  async function handleDeleteService(serviceId) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/services/${serviceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to delete service");
      return;
    }

    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Monitor bookings, revenue and services
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/admin/login");
          }}
        >
          Sign out
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Bookings", summary.bookings.total],
          ["Pending", summary.bookings.pending],
          ["Completed", summary.bookings.completed],
          [
            "Revenue",
            `Rs ${summary.revenue.total?.toFixed?.(0) ?? 0}`,
          ],
        ].map(([title, value]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                {title}
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900">
                {value}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings (Last 30 Days)</CardTitle>
          </CardHeader>
          <div className="h-64 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.bookings_over_time ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
          </CardHeader>
          <div className="h-64 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.revenue_by_service ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service_name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Manage appointment status and time slots
          </CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="text-left">Service</th>
                <th className="text-left">Date</th>
                <th className="text-left">Time</th>
                <th className="text-left">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="text-xs text-gray-500">
                      {b.customer_email}
                    </div>
                  </td>
                  <td>{b.service_name}</td>
                  <td>{b.preferred_date}</td>
                  <td>
                    <Input
                      className="h-8 w-28"
                      value={b.time_slot || ""}
                      onChange={(e) =>
                        setBookings((prev) =>
                          prev.map((row) =>
                            row.id === b.id
                              ? {
                                  ...row,
                                  time_slot: e.target.value,
                                }
                              : row
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="h-8 rounded-md border px-2"
                      value={b.status}
                      onChange={(e) =>
                        setBookings((prev) =>
                          prev.map((row) =>
                            row.id === b.id
                              ? {
                                  ...row,
                                  status: e.target.value,
                                }
                              : row
                          )
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(
                          b.id,
                          b.status,
                          b.time_slot
                        )
                      }
                    >
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services Management</CardTitle>
          <CardDescription>
            Add, edit or deactivate services that appear on the public site
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.name}</span>
                    {!s.is_active && (
                      <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-sm text-gray-600">{s.description}</p>
                  )}
                  <div className="mt-1 flex gap-3 text-sm text-gray-500">
                    <span>₹{s.price}</span>
                    {s.duration_minutes && (
                      <span>{s.duration_minutes} min</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleService(s.id, s.is_active)}
                  >
                    {s.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteService(s.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleCreateService}
            className="grid gap-3 border-t pt-4"
          >
            <Label className="text-base font-semibold">Add New Service</Label>
            <Input
              placeholder="Service Name (e.g., Teeth Cleaning)"
              value={newService.name}
              onChange={(e) =>
                setNewService((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
              required
            />
            <Input
              placeholder="Description (optional)"
              value={newService.description}
              onChange={(e) =>
                setNewService((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Price (₹)"
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) =>
                  setNewService((p) => ({
                    ...p,
                    price: e.target.value,
                  }))
                }
                required
              />
              <Input
                placeholder="Duration (minutes)"
                type="number"
                value={newService.duration_minutes}
                onChange={(e) =>
                  setNewService((p) => ({
                    ...p,
                    duration_minutes: e.target.value,
                  }))
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Add Service
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}