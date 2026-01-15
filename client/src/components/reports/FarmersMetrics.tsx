"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { BoxIconLine, GroupIcon, InfoIcon } from "@/icons";
import { getAuthToken } from "@/lib/cookies";

interface FarmerStats {
  total: number;
  pending: number;
  certified: number;
  declined: number;
}

export const FarmersMetrics = () => {
  const [stats, setStats] = useState<FarmerStats>({
    total: 0,
    pending: 0,
    certified: 0,
    declined: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/farmers/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch farmer stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const getPercentage = (count: number) => {
    if (stats.total === 0) return "0%";
    return `${((count / stats.total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 pb-2">
      {/* <!-- Total Farmers --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Farmers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.total.toLocaleString()}
            </h4>
          </div>
          <Badge color="info">All</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Pending Farmers --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl dark:bg-yellow-900/30">
          <BoxIconLine className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Approval
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.pending.toLocaleString()}
            </h4>
          </div>
          <Badge color="warning">{getPercentage(stats.pending)}</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Certified Farmers --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/30">
          <BoxIconLine className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Certified Farmers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.certified.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">{getPercentage(stats.certified)}</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Declined Farmers --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl dark:bg-red-900/30">
          <InfoIcon className="text-red-600 dark:text-red-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Declined Farmers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : stats.declined.toLocaleString()}
            </h4>
          </div>
          <Badge color="error">{getPercentage(stats.declined)}</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
