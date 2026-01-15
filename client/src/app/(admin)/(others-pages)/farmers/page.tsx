"use client";

import { useAuth } from "@/hooks/useAuth";
import { getFarmerData, getProfile } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function FarmerDashboard() {
  const { token, isLoading, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [farmer, setFarmer] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [profileData, farmerData] = await Promise.all([
          getProfile(),
          getFarmerData(),
        ]);
        setProfile(profileData);
        setFarmer(farmerData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load data"
        );
      }
    }

    loadData();
  }, [token]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Farmer Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {profile && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white/90">
            Profile
          </h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-800 dark:text-white/80">Name:</strong>{" "}
              {profile.firstName} {profile.lastName}
            </p>
            <p>
              <strong className="text-gray-800 dark:text-white/80">Email:</strong>{" "}
              {profile.email}
            </p>
            {profile.phoneNumber && (
              <p>
                <strong className="text-gray-800 dark:text-white/80">Phone:</strong>{" "}
                {profile.phoneNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {farmer && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white/90">
            Farm Details
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p className="flex items-center gap-2">
              <strong className="text-gray-800 dark:text-white/80">Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  farmer.registrationStatus === "certified"
                    ? "bg-green-500"
                    : farmer.registrationStatus === "declined"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              >
                {farmer.registrationStatus}
              </span>
            </p>
            {farmer.farmName && (
              <p>
                <strong className="text-gray-800 dark:text-white/80">Farm Name:</strong>{" "}
                {farmer.farmName}
              </p>
            )}
            {farmer.farmLocation && (
              <p>
                <strong className="text-gray-800 dark:text-white/80">Location:</strong>{" "}
                {farmer.farmLocation}
              </p>
            )}
            {farmer.farmSize && (
              <p>
                <strong className="text-gray-800 dark:text-white/80">Farm Size:</strong>{" "}
                {farmer.farmSize}
              </p>
            )}
            {farmer.cropsPlanted && farmer.cropsPlanted.length > 0 && (
              <p>
                <strong className="text-gray-800 dark:text-white/80">Crops Planted:</strong>{" "}
                {farmer.cropsPlanted.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
