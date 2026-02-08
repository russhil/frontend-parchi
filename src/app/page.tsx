import GreetingHero from "@/components/home/GreetingHero";
import SmartSearch from "@/components/home/SmartSearch";
import TodayAppointments from "@/components/home/TodayAppointments";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      <GreetingHero />
      <SmartSearch />
      <TodayAppointments />
    </div>
  );
}
