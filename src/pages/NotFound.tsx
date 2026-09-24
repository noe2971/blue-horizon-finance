import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-100 px-4">
    <div className="text-center">
      <h1 className="text-5xl font-extrabold mb-3">404</h1>
      <p className="text-slate-400 mb-6">This page doesn't exist. Your forgotten subscriptions do.</p>
      <Link to="/scan" className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
        Find them
      </Link>
    </div>
  </div>
);

export default NotFound;
