import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";

const navItems = [
  { to: "/browse", label: "New Cars" },
  { to: "/used-cars", label: "Used Cars" },
  { to: "/compare", label: "Compare" },
  { to: "/reviews", label: "Reviews" },
  { to: "/news", label: "News" }
];

export const AppShell = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-appBg text-textPrimary">
      <header className="sticky top-0 z-40 border-b border-appBorder bg-white/90 backdrop-blur-md">
        <div className="app-container flex h-[72px] items-center gap-4 py-3">
          <NavLink to="/" className="shrink-0 font-heading text-lg font-bold tracking-tight text-brandNavy">
            CarDekho Replica
          </NavLink>
          <form
            className="hidden flex-1 items-center rounded-lg border border-appBorder bg-white px-3 py-2 md:flex"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(`/browse?q=${encodeURIComponent(search)}`);
            }}
          >
            <Search size={16} className="text-textSecondary/80" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by brand, model, or budget"
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-textSecondary/70"
            />
          </form>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-brandRed/10 px-3 py-2 font-semibold text-brandRed"
                    : "rounded-md px-3 py-2 text-textSecondary transition hover:bg-slate-100 hover:text-textPrimary"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button className="rounded-lg border border-appBorder bg-white px-3 py-2 text-sm font-semibold text-textPrimary transition hover:border-slate-300 hover:bg-slate-50">
            Login / Sign Up
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-14 border-t border-slate-700/30 bg-brandNavy py-12 text-white">
        <div className="app-container grid gap-7 md:grid-cols-4">
          <div>
            <h4 className="font-heading text-lg">CarDekho Replica</h4>
            <p className="mt-2 text-sm text-white/80">
              Decision-first car buying platform for confident shortlisting.
            </p>
          </div>
          <div>
            <h5 className="font-semibold">Research</h5>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li>New Cars</li>
              <li>Used Cars</li>
              <li>EV Cars</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Buying Tools</h5>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li>EMI Calculator</li>
              <li>On-road Price</li>
              <li>Compare Cars</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">App</h5>
            <p className="mt-2 text-sm text-white/80">Download on Android and iOS</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded border border-white/30 px-3 py-1 text-xs">Play Store</span>
              <span className="rounded border border-white/30 px-3 py-1 text-xs">App Store</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
