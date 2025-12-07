"use client";
import { useRouter, usePathname } from "next/navigation";

export default function DayNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const match = pathname.match(/day(\d+)/i);
  const currentDay = match ? parseInt(match[1]) : null;

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const goToDay = (day) => {
    if (day < 1) {
      router.push("/");
      return;
    }

    if (!(month === 11 && date >= day)) {
      router.push("/");
      return;
    }

    router.push(`/advent/day${day}`);
  };

  if (!currentDay) return null;

  return (
    <div className="day-nav-container">
      <button
        className="day-nav-btn"
        onClick={() => goToDay(currentDay - 1)}
      >
        ↰ Jour précédent
      </button>

      <button
        className="day-nav-btn"
        onClick={() => router.push("/")}
      >
        Accueil
      </button>

      <button
        className="day-nav-btn"
        onClick={() => goToDay(currentDay + 1)}
      >
        Jour suivant ↱
      </button>
    </div>
  );
}
