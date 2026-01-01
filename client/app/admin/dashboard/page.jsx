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
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  DollarSign,
  Clock,
  Mail,
  Plus,
  LogOut,
  TrendingUp,
  Activity,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://dentist-serverless-tw1a.vercel.app";

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
  const [showCompleted, setShowCompleted] = useState(false);

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
            fetch(`${API_BASE}/api/services`, { headers }),
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

  const toggleTimeFormat = (bookingId, currentTimeSlot) => {
    if (!currentTimeSlot) return;
    
    let newTimeSlot = currentTimeSlot;
    
    // Check if it contains AM/PM
    if (currentTimeSlot.includes("AM") || currentTimeSlot.includes("PM")) {
      // Convert to 24-hour format
      const match = currentTimeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let [, hours, minutes, period] = match;
        hours = parseInt(hours);
        if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
        newTimeSlot = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
    } else {
      // Convert to 12-hour format with AM/PM
      const match = currentTimeSlot.match(/(\d+):(\d+)/);
      if (match) {
        let [, hours, minutes] = match;
        hours = parseInt(hours);
        const period = hours >= 12 ? "PM" : "AM";
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        newTimeSlot = `${hours}:${minutes} ${period}`;
      }
    }
    
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, time_slot: newTimeSlot }
          : b
      )
    );
  };

  async function handleStatusChange(id, status, time_slot) {
    const token = getToken();
    if (!token) {
      alert('Authentication required. Please log in again.');
      return;
    }

    // Validate time slot for confirmed bookings
    if (status === 'confirmed' && (!time_slot || time_slot.trim() === '')) {
      alert('Please set a time slot before confirming the booking');
      return;
    }

    try {
      console.log('Sending update:', { id, status, time_slot });
      
      const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: status.toLowerCase().trim(), 
          time_slot: time_slot || null 
        }),
      });

      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        alert(data.message || `Server error: ${res.status}`);
        return;
      }
      
      if (!data.success) {
        alert(data.message || "Failed to update booking");
        return;
      }

      // Update local state with the returned booking data
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? data.booking : b))
      );

      // Show success message based on status
      if (status === 'confirmed') {
        alert('✅ Booking confirmed! Confirmation email sent to patient.');
      } else if (status === 'cancelled') {
        alert('❌ Booking cancelled. Cancellation email sent to patient.');
      } else if (status === 'completed') {
        alert('✔️ Booking marked as completed (no email sent).');
      } else if (status === 'pending') {
        alert('⏳ Booking status updated to pending.');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert(`Failed to update booking: ${err.message}`);
    }
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
    alert('✅ Service created successfully!');
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
    alert('✅ Service deleted successfully!');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-pulse text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: summary.bookings.total,
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Pending",
      value: summary.bookings.pending,
      icon: Clock,
      color: "amber",
    },
    {
      title: "Completed",
      value: summary.bookings.completed,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Total Revenue",
      value: `₹${summary.revenue.total?.toFixed?.(0) ?? 0}`,
      icon: DollarSign,
      color: "purple",
    },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  // Filter bookings based on showCompleted toggle
  const filteredBookings = showCompleted 
    ? bookings.filter(b => b.status === 'completed')
    : bookings.filter(b => b.status !== 'completed');

  const activeBookingsCount = bookings.filter(b => b.status !== 'completed').length;
  const completedBookingsCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/admin/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`rounded-full p-3 ${colorMap[stat.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Bookings Trend</CardTitle>
              </div>
              <CardDescription>Last 30 days performance</CardDescription>
            </CardHeader>
            <div className="pt-6 px-6 pb-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts?.bookings_over_time ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis 
                      allowDecimals={false} 
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Revenue</CardTitle>
              </div>
              <CardDescription>By service type</CardDescription>
            </CardHeader>
            <div className="pt-6 px-6 pb-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.revenue_by_service ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="service_name" 
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      stroke="#888"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">
                    {showCompleted ? 'Completed Bookings' : 'Active Bookings'}
                  </CardTitle>
                </div>
                <CardDescription>
                  {showCompleted 
                    ? `Viewing ${completedBookingsCount} completed appointment${completedBookingsCount !== 1 ? 's' : ''}`
                    : `Managing ${activeBookingsCount} active appointment${activeBookingsCount !== 1 ? 's' : ''}`
                  }
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Show Active
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Completed ({completedBookingsCount})
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {showCompleted 
                          ? 'No completed bookings yet'
                          : 'No active bookings to display'
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                              {b.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {b.customer_name}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Mail className="h-3 w-3" />
                                {b.customer_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {b.service_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {b.preferred_date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Input
                              className="h-9 w-32 border-gray-200"
                              placeholder="Set time"
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
                            <button
                              onClick={() => toggleTimeFormat(b.id, b.time_slot)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              title="Toggle AM/PM format"
                            >
                              <RefreshCw className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
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
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            className="cursor-pointer hover:bg-blue-700 transition-colors"
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Services Management */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Services Management</CardTitle>
            </div>
            <CardDescription>
              Add, edit or deactivate services that appear on the public site
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            <div className="space-y-4">
              {/* Services List */}
              <div className="space-y-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {s.name}
                        </span>
                        {!s.is_active && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {s.description}
                        </p>
                      )}
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="font-medium text-green-600">
                          ₹{s.price}
                        </span>
                        {s.duration_minutes && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            {s.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleToggleService(s.id, s.is_active)}
                      >
                        {s.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteService(s.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Service Form */}
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
                <form onSubmit={handleCreateService} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-gray-600" />
                    <Label className="text-base font-semibold text-gray-900">
                      Add New Service
                    </Label>
                  </div>
                  
                  <Input
                    placeholder="Service Name (e.g., Teeth Cleaning)"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService((p) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                    className="border-gray-200"
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
                    className="border-gray-200"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
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
                      className="border-gray-200"
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
                      className="border-gray-200"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full gap-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Service
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}