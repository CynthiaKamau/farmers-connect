"use client";

import { useAuth } from "@/hooks/useAuth";
import { getFarmerData, getProfile } from "@/lib/auth";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: {
    name: string;
  };
}

interface FarmerData {
  id: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  cropsPlanted?: string[];
  registrationStatus: string;
}

export default function Profile() {
  const { token, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [farmer, setFarmer] = useState<FarmerData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        // Only fetch farmer data if user is a farmer
        if (profileData.role?.name === "farmer") {
          const farmerData = await getFarmerData();
          setFarmer(farmerData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    }

    loadData();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20 lg:p-6">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Meta Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col items-center gap-6 xl:flex-row">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
            <span className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
              {profile?.firstName?.charAt(0)}
              {profile?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="text-center xl:text-left">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
              {profile?.firstName} {profile?.lastName}
            </h4>
            <div className="flex flex-col items-center gap-2 xl:flex-row xl:gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  profile?.role?.name === "admin"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {profile?.role?.name === "admin" ? "Administrator" : "Farmer"}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Personal Information
        </h4>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              First Name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {profile?.firstName || "-"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              Last Name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {profile?.lastName || "-"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              Email Address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {profile?.email || "-"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              Phone Number
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {profile?.phoneNumber || "-"}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
              Role
            </p>
            <p className="text-sm font-medium capitalize text-gray-800 dark:text-white/90">
              {profile?.role?.name || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Farm Details Card - Only for farmers */}
      {farmer && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Farm Details
            </h4>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                farmer.registrationStatus === "certified"
                  ? "bg-green-500"
                  : farmer.registrationStatus === "declined"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            >
              {farmer.registrationStatus}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Farm Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {farmer.farmName || "-"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Farm Location
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {farmer.farmLocation || "-"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Farm Size
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {farmer.farmSize || "-"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Crops Planted
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {farmer.cropsPlanted?.length
                  ? farmer.cropsPlanted.join(", ")
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
