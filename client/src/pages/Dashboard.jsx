import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roleFeatures = {
  farmer: {
    title: "Farmer Dashboard",
    subtitle: "Manage your farm, connect with buyers, and grow your business.",
    label: "FARMER WORKSPACE",
    features: [
      { title: "Add Crop Listing", description: "Publish your available crops for buyers.", path: "/add-crop", icon: "＋", category: "CROP MANAGEMENT" },
      { title: "My Crop Listings", description: "View and manage your existing listings.", path: "/my-crops", icon: "▤", category: "CROP MANAGEMENT" },
      { title: "Buyer Requests", description: "Review crop reservation requests.", path: "/farmer-requests", icon: "⇄", category: "ORDERS & REQUESTS" },
      { title: "Orders", description: "Manage your crop orders.", path: "/farmer-orders", icon: "▣", category: "ORDERS & REQUESTS" },
      { title: "Cold Storage", description: "Find and book storage facilities.", path: "/browse-cold-storage", icon: "▦", category: "FARM SERVICES" },
      { title: "Storage Bookings", description: "Track your storage booking requests.", path: "/my-storage-bookings", icon: "▤", category: "FARM SERVICES" },
      { title: "Transport", description: "Arrange transportation for your produce.", path: "/my-transport-requests", icon: "⇢", category: "FARM SERVICES" },
      { title: "Market Prices", description: "Explore agricultural market prices.", path: "/market-prices", icon: "₹", category: "AGRICULTURE INSIGHTS" },
      { title: "Weather", description: "Check weather forecasts and conditions.", path: "/weather", icon: "☼", category: "AGRICULTURE INSIGHTS" },
      { title: "Government Schemes", description: "Explore agricultural schemes and support.", path: "/government-schemes", icon: "▥", category: "AGRICULTURE INSIGHTS" },
      { title: "Profile", description: "Manage your account information.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "Check alerts and recent updates.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  },
  buyer: {
    title: "Buyer Dashboard",
    subtitle: "Discover fresh produce and manage your agricultural purchases.",
    label: "BUYER WORKSPACE",
    features: [
      { title: "Search Crops", description: "Discover crops available from farmers.", path: "/browse-crops", icon: "⌕", category: "DISCOVER PRODUCE" },
      { title: "Available Produce", description: "Browse available agricultural produce.", path: "/browse-crops", icon: "▤", category: "DISCOVER PRODUCE" },
      { title: "My Reservations", description: "Track your crop reservations.", path: "/my-reservations", icon: "▣", category: "PURCHASE MANAGEMENT" },
      { title: "Orders", description: "View and manage your crop orders.", path: "/my-orders", icon: "⇄", category: "PURCHASE MANAGEMENT" },
      { title: "Market Prices", description: "Compare current agricultural prices.", path: "/market-prices", icon: "₹", category: "AGRICULTURE INSIGHTS" },
      { title: "Weather", description: "Check weather forecasts and conditions.", path: "/weather", icon: "☼", category: "AGRICULTURE INSIGHTS" },
      { title: "Government Schemes", description: "Explore agricultural schemes and support.", path: "/government-schemes", icon: "▥", category: "AGRICULTURE INSIGHTS" },
      { title: "Profile", description: "Manage your account information.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "Check alerts and recent updates.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  },
  coldStorageOwner: {
    title: "Cold Storage Dashboard",
    subtitle: "Manage your storage facilities and respond to booking requests.",
    label: "STORAGE PARTNER WORKSPACE",
    features: [
      { title: "Add Storage", description: "Register a new cold storage facility.", path: "/add-cold-storage", icon: "＋", category: "FACILITY MANAGEMENT" },
      { title: "My Storage", description: "View and manage your facilities.", path: "/my-cold-storage", icon: "▦", category: "FACILITY MANAGEMENT" },
      { title: "Booking Requests", description: "Review incoming farmer requests.", path: "/storage-requests", icon: "⇄", category: "BOOKINGS" },
      { title: "Profile", description: "Manage your account information.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "Check alerts and recent updates.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  },
  transportProvider: {
    title: "Transport Dashboard",
    subtitle: "Organize your vehicles, find transport requests, and manage deliveries.",
    label: "TRANSPORT PARTNER WORKSPACE",
    features: [
      { title: "Add Vehicle", description: "Register a vehicle for transport services.", path: "/add-vehicle", icon: "＋", category: "FLEET MANAGEMENT" },
      { title: "My Vehicles", description: "Manage your registered vehicles.", path: "/my-vehicles", icon: "▤", category: "FLEET MANAGEMENT" },
      { title: "Transport Requests", description: "Review available transport requests.", path: "/transport-requests", icon: "⌕", category: "DELIVERY MANAGEMENT" },
      { title: "My Assignments", description: "Manage your delivery assignments.", path: "/transport-assignments", icon: "⇢", category: "DELIVERY MANAGEMENT" },
      { title: "Profile", description: "Manage your account information.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "Check alerts and recent updates.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Access platform administration and management tools.",
    label: "ADMIN WORKSPACE",
    features: [
      { title: "Admin Panel", description: "Access the platform management panel.", path: "/admin", icon: "▦", category: "PLATFORM MANAGEMENT" },
      { title: "Manage Users", description: "Access user management tools.", path: "/admin", icon: "◎", category: "PLATFORM MANAGEMENT" },
      { title: "Manage Crops", description: "Access crop management tools.", path: "/admin", icon: "▤", category: "PLATFORM MANAGEMENT" },
      { title: "Orders", description: "Access platform order management.", path: "/admin", icon: "⇄", category: "PLATFORM MANAGEMENT" },
      { title: "Profile", description: "Manage your account information.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "Check alerts and recent updates.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  },
};

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const dashboard = roleFeatures[user.role] || {
    title: "Dashboard",
    subtitle: "Welcome to Krishi-Connect. Manage your account from here.",
    label: "YOUR WORKSPACE",
    features: [
      { title: "Profile", description: "View and update your account.", path: "/profile", icon: "◎", category: "ACCOUNT" },
      { title: "Notifications", description: "View your latest alerts.", path: "/notifications", icon: "♧", category: "ACCOUNT" },
    ],
  };

  const groupedFeatures = dashboard.features.reduce((groups, feature) => {
    const category = feature.category || "OTHER";
    if (!groups[category]) groups[category] = [];
    groups[category].push(feature);
    return groups;
  }, {});

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const initials = (user.name || "KC").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  const roleLabel = user.role === "coldStorageOwner" ? "Cold Storage Owner" : user.role === "transportProvider" ? "Transport Provider" : user.role || "Member";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f8f2] text-slate-800">
      <header className="sticky top-0 z-30 border-b border-green-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-3 text-left" aria-label="Go to homepage">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-xl font-bold text-white shadow-sm">K</span>
            <span>
              <span className="block text-lg font-extrabold tracking-tight text-green-900 sm:text-xl">Krishi<span className="text-green-600">-Connect</span></span>
              <span className="hidden text-[11px] font-medium tracking-widest text-slate-500 sm:block">GROW TOGETHER</span>
            </span>
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={() => navigate("/notifications")} className="rounded-xl border border-green-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-green-50 hover:text-green-800 sm:px-4">Notifications</button>
            <button type="button" onClick={() => navigate("/profile")} className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-green-50 sm:gap-3 sm:pr-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">{initials}</span>
              <span className="hidden text-left sm:block"><span className="block max-w-32 truncate text-sm font-bold text-slate-800">{user.name}</span><span className="block text-xs text-slate-500">{roleLabel}</span></span>
            </button>
            <button type="button" onClick={handleLogout} className="rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:px-4">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-green-950 via-green-800 to-green-700 px-6 py-8 shadow-lg sm:px-10 sm:py-11 lg:px-12">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[38px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-lime-300/10 blur-2xl" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-green-100">{dashboard.label}</span>
              <p className="mt-5 text-sm font-medium text-green-100">Welcome back, {firstName}</p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{dashboard.title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-green-50/90 sm:text-base">{dashboard.subtitle}</p>
              <button type="button" onClick={() => navigate("/profile")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-green-50">View my profile <span aria-hidden="true">→</span></button>
            </div>
            <div className="hidden min-w-48 flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-7 text-center backdrop-blur-sm md:flex">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-300 text-2xl font-extrabold text-green-950">{initials}</span>
              <p className="mt-4 max-w-40 truncate text-lg font-bold text-white">{user.name}</p>
              <p className="mt-1 text-xs text-green-100">{roleLabel}</p>
              <span className="mt-4 rounded-full bg-green-400/15 px-3 py-1 text-xs font-semibold text-green-100">Your workspace</span>
            </div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-700">▦</span><div><p className="text-sm text-slate-500">Your workspace</p><p className="mt-0.5 text-lg font-bold text-slate-800">{dashboard.features.length} tools</p></div></div><p className="mt-3 text-xs leading-5 text-slate-500">Shortcuts available for your account.</p></div>
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-50 text-xl text-lime-700">↗</span><div><p className="text-sm text-slate-500">Quick access</p><p className="mt-0.5 text-lg font-bold text-slate-800">One-click actions</p></div></div><p className="mt-3 text-xs leading-5 text-slate-500">Open the tools you need from the cards below.</p></div>
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">◎</span><div><p className="text-sm text-slate-500">Account</p><p className="mt-0.5 max-w-48 truncate text-lg font-bold text-slate-800">{user.name}</p></div></div><p className="mt-3 text-xs leading-5 text-slate-500">Review your profile and account details.</p></div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">YOUR TOOLS</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Explore your workspace</h2><p className="mt-2 text-sm leading-6 text-slate-500">Everything you need, organized in one place.</p></div>
            <span className="text-sm font-medium text-slate-500">{dashboard.features.length} available shortcuts</span>
          </div>
          <div className="space-y-9">
            {Object.entries(groupedFeatures).map(([category, features]) => (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3"><h3 className="text-xs font-extrabold tracking-[0.14em] text-slate-500">{category}</h3><div className="h-px flex-1 bg-green-100" /></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {features.map((feature) => (
                    <button key={`${feature.title}-${feature.path}`} type="button" onClick={() => navigate(feature.path)} className="group flex min-h-48 flex-col rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:p-6">
                      <span className="flex w-full items-start justify-between gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl font-semibold text-green-800 transition group-hover:bg-green-700 group-hover:text-white">{feature.icon}</span><span className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-slate-300 transition group-hover:bg-green-50 group-hover:text-green-700">↗</span></span>
                      <span className="mt-5 block text-lg font-bold text-slate-800 transition group-hover:text-green-800">{feature.title}</span>
                      <span className="mt-2 block flex-1 text-sm leading-6 text-slate-500">{feature.description}</span>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700">Open feature <span className="transition group-hover:translate-x-1">→</span></span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-green-100 py-6"><div className="flex flex-col justify-between gap-2 text-sm text-slate-500 sm:flex-row sm:items-center"><p><span className="font-bold text-green-800">Krishi-Connect</span> — Connecting agriculture, empowering communities.</p><button type="button" onClick={() => navigate("/profile")} className="self-start font-semibold text-green-700 hover:text-green-900 sm:self-auto">Account settings →</button></div></footer>
      </main>
    </div>
  );
}

export default Dashboard;
