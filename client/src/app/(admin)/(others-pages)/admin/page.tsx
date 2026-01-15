"use client";

import { useAuth } from "@/hooks/useAuth";
import { getAdminFarmers, updateFarmerStatus } from "@/lib/auth";
import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import FarmersTable from "@/components/tables/FarmersTable";

export default function AdminDashboard() {
  const { token, isLoading } = useAuth();
  const [farmers, setFarmers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function loadFarmers() {
      try {
        const data = await getAdminFarmers();
        setFarmers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load farmers"
        );
      }
    }

    loadFarmers();
  }, [token]);

  const handleStatus = async (
    farmerId: string,
    status: "certified" | "declined"
  ) => {
    if (!token) return;

    setUpdating(farmerId);
    try {
      await updateFarmerStatus(farmerId, status);
      setFarmers((prev) =>
        prev.map((farmer) =>
          farmer.id === farmerId
            ? { ...farmer, registrationStatus: status }
            : farmer
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage Farmers" />
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <ComponentCard
          title="Farmer Applications"
          desc="Review and manage farmer registration applications. You can certify or decline each application."
        >
          <FarmersTable
            farmers={farmers}
            updating={updating}
            onStatusChange={handleStatus}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
