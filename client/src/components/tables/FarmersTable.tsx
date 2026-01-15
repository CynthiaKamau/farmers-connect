"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface Farmer {
  id: string;
  farmName: string;
  farmLocation: string;
  farmSize: string;
  cropsPlanted: string[];
  registrationStatus: "pending" | "certified" | "declined";
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
}

interface FarmersTableProps {
  farmers: Farmer[];
  updating: string | null;
  onStatusChange: (farmerId: string, status: "certified" | "declined") => void;
}

export default function FarmersTable({
  farmers,
  updating,
  onStatusChange,
}: FarmersTableProps) {
  // Ensure farmers is always an array
  const farmersList = Array.isArray(farmers) ? farmers : [];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Farmer
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Farm Details
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Crops
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {farmersList.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          {farmer.user?.firstName?.charAt(0)}
                          {farmer.user?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {farmer.user?.firstName} {farmer.user?.lastName}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {farmer.user?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {farmer.farmName || "-"}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {farmer.farmSize || "Size not specified"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {farmer.farmLocation || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {farmer.cropsPlanted && farmer.cropsPlanted.length > 0 ? (
                        farmer.cropsPlanted.slice(0, 3).map((crop, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          >
                            {crop}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-theme-sm dark:text-gray-400">
                          -
                        </span>
                      )}
                      {farmer.cropsPlanted && farmer.cropsPlanted.length > 3 && (
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          +{farmer.cropsPlanted.length - 3} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        farmer.registrationStatus === "certified"
                          ? "success"
                          : farmer.registrationStatus === "declined"
                          ? "error"
                          : "warning"
                      }
                    >
                      {farmer.registrationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStatusChange(farmer.id, "certified")}
                        disabled={
                          updating === farmer.id ||
                          farmer.registrationStatus === "certified"
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Certify
                      </button>
                      <button
                        onClick={() => onStatusChange(farmer.id, "declined")}
                        disabled={
                          updating === farmer.id ||
                          farmer.registrationStatus === "declined"
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Decline
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {farmersList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                No farmer applications yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
