import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-slate-950">
      <Scissors className="h-4 w-4" />
    </span>
    SubSlayer
  </Link>
);
