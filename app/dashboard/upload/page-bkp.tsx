"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type UploadStats = {
  total: number;
  success: number;
  failed: number;
  skipped: number;
};

type LogEntry = {
  index: number;
  name: string;
  status: "success" | "error" | "skipped";
  message: string;
};

// Define allowed fields for each model based on your Mongoose schemas
const SCHEMA_FIELDS: Record<string, string[]> = {
  "/api/states": [
    "state_id",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_districts",
    "total_tehsils",
    "total_blocks",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "nearest_city",
    "nearest_airport",
    "major_crops",
    "main_occupation",
  ],
  "/api/districts": [
    "district_id",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_tehsils",
    "total_blocks",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "nearest_city",
    "nearest_railway_station",
    "nearest_airport",
    "roads",
    "major_crops",
    "primary_health_center",
    "post_title",
    "post_name",
    "state_1",
  ],
  "/api/tehsil": [
    "block_id",
    "block_tehsil",
    "block_slug",
    "district",
    "district_slug",
    "state",
    "state_slug",
    "country",
    "census_year",
    "total_villages",
    "total_population",
    "male_population",
    "female_population",
    "sc_population",
    "st_population",
    "total_households",
    "avg_literacy_rate",
    "avg_male_literacy",
    "avg_female_literacy",
    "headquarter_town",
    "nearest_city",
    "pin_code",
    "nearest_railway_station",
    "nearest_airport",
    "latitude",
    "longitude",
    "roads",
    "internet",
    "mobile_networks",
    "drinking_water",
    "major_crops",
    "main_occupation",
    "primary_health_center",
    "district_hospital",
  ],
  "/api/village": [
    "village_id",
    "village_name",
    "block_tehsil",
    "district",
    "state",
    "pin_code",
    "police_station",
    "total_population",
    "male_population",
    "female_population",
    "sex_ratio",
    "child_population_0_6",
    "avg_literacy_rate",
    "male_literacy_rate",
    "female_literacy_rate",
    "sc_population",
    "st_population",
    "total_households",
    "primary_school",
    "secondary_school",
    "primary_health_center",
    "nearest_town",
    "distance_to_town_km",
    "nearest_railway_station",
    "railway_distance_km",
    "nearest_airport",
    "airport_distance_km",
    "major_crops",
    "major_religions",
    "festivals",
    "electricity",
    "roads",
    "drinking_water",
    "internet",
    "mobile_networks",
    "gram_panchayat",
    "ward_count",
    "terrain_geography",
    "climate_weather",
    "main_occupation",
    "village_rating_1_5",
    "nearest_city",
    "country",
    "census_year",
    "latitude",
    "longitude",
    "block_slug",
    "district_slug",
    "state_slug",
    "village_slug",
    "post_title",
    "post_name",
    "tehsil",
    "farms",
  ],
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiEndpoint, setApiEndpoint] = useState("/api/village");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStats(null);
      setLogs([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStats({ total: 0, success: 0, failed: 0, skipped: 0 });
    setLogs([]);

    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("Excel file is empty!");
        setUploading(false);
        return;
      }

      // Check for unknown columns
      const firstRow = jsonData[0] as Record<string, unknown>;
      const excelColumns = Object.keys(firstRow);
      const schemaColumns = SCHEMA_FIELDS[apiEndpoint] || [];
      console.log("Excel columns:", excelColumns);
      console.log("Expected schema columns:", schemaColumns);
      const unknownColumns = excelColumns.filter(
        (col) => !schemaColumns.includes(col),
      );

      // Show warning if there are unknown columns
      if (unknownColumns.length > 0) {
        const proceed = window.confirm(
          `⚠️ Unknown columns detected in your Excel file:\n\n${unknownColumns.join(", ")}\n\n` +
            `These fields are NOT in your Mongoose schema and will be automatically filtered out before uploading.\n\n` +
            `Do you want to continue?`,
        );
        // console.warn("Unknown columns:", unknownColumns, proceed);
        if (!proceed) {
          setUploading(false);
          return;
        }
      }

      const total = jsonData.length;
      let success = 0;
      let failed = 0;
      let skipped = 0;
      const newLogs: LogEntry[] = [];

      // Upload each row
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as Record<string, unknown>;

        // Filter out unknown columns - only send schema fields
        const filteredRow = Object.keys(row)
          .filter((key) => schemaColumns.includes(key))
          .reduce(
            (obj, key) => {
              obj[key] = row[key];
              return obj;
            },
            {} as Record<string, unknown>,
          );
        // // 🔍 DEBUG: Log what's being sent
        // console.log("Sending to API:", filteredRow);
        // console.log("police_station value:", filteredRow.police_station);

        const rowName = (row.village_name ||
          row.district ||
          row.state ||
          row.block_tehsil ||
          `Row ${i + 2}`) as string;

        try {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredRow),
          });

          if (response.ok) {
            success++;
            newLogs.push({
              index: i + 2,
              name: rowName,
              status: "success",
              message: "Inserted successfully",
            });
          } else {
            const errorData = await response.json();

            if (response.status === 409) {
              skipped++;
              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "skipped",
                message: "Already exists (duplicate)",
              });
            } else {
              failed++;
              const errorMsg = errorData.details
                ? Array.isArray(errorData.details)
                  ? errorData.details.join(", ")
                  : JSON.stringify(errorData.details)
                : errorData.error || "Unknown error";

              newLogs.push({
                index: i + 2,
                name: rowName,
                status: "error",
                message: `${response.status}: ${errorMsg}`,
              });
            }
          }
        } catch (error) {
          failed++;
          newLogs.push({
            index: i + 2,
            name: rowName,
            status: "error",
            message: error instanceof Error ? error.message : "Network error",
          });
        }

        // Update stats in real-time
        setStats({ total, success, failed, skipped });
        setLogs([...newLogs]);
      }
    } catch (error) {
      alert(
        `Failed to read Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Excel to MongoDB Uploader</h1>

          {/* API Endpoint Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint
            </label>
            <select
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="/api/states">States</option>
              <option value="/api/districts">Districts</option>
              <option value="/api/tehsil">Tehsils</option>
              <option value="/api/village">Villages</option>
            </select>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition ${
              !file || uploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload to MongoDB"}
          </button>

          {/* Stats */}
          {stats && (
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">
                  {stats.success}
                </div>
                <div className="text-sm text-green-600">Success</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {stats.skipped}
                </div>
                <div className="text-sm text-yellow-600">Skipped</div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">
                  {stats.failed}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Upload Log</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 p-2 rounded text-sm ${
                      log.status === "success"
                        ? "bg-green-50 text-green-800"
                        : log.status === "skipped"
                          ? "bg-yellow-50 text-yellow-800"
                          : "bg-red-50 text-red-800"
                    }`}
                  >
                    <span className="font-medium">Row {log.index}:</span>{" "}
                    {log.name} - <span className="italic">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
