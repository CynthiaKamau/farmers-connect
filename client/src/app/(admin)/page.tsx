import type { Metadata } from "next";
import { FarmersMetrics} from "@/components/reports/FarmersMetrics";
import MonthlyTarget from "@/components/reports/MonthlyTarget";
import StatisticsChart from "@/components/reports/StatisticsChart";
import RecentOrders from "@/components/reports/RecentOrders";
import DemographicCard from "@/components/reports/DemographicCard";
import MonthlyReportChart from "@/components/reports/MonthlyReportChart";
import CountryMap from "@/components/reports/CountryMap";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <FarmersMetrics/>

        <MonthlyReportChart />

        <CountryMap />
      </div>

    </div>
  );
}
