import { LogIn } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/browse";

  return (
    <div className="app-container py-10">
      <section className="mx-auto max-w-md card-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-lg bg-brandRed/10 p-2 text-brandRed">
            <LogIn size={20} />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold">Login / Sign Up</h1>
            <p className="text-sm text-textSecondary">Sign in to save cars to your shortlist.</p>
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(redirect);
          }}
        >
          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              placeholder="Enter password"
              className="mt-1 w-full rounded-lg border border-appBorder px-3 py-2 outline-none transition focus:border-slate-400"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-brandRed px-4 py-2 font-semibold text-white transition hover:bg-zinc-800"
          >
            Continue
          </button>
        </form>

        <Link to="/browse" className="mt-4 inline-block text-sm font-medium text-brandRed">
          Continue browsing
        </Link>
      </section>
    </div>
  );
};

export default LoginPage;
