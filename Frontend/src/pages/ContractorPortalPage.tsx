import React, { useState, useEffect } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Search,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Filter,
  Loader2
} from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { PotholeReport } from "../types";
import potholeFallback from "../assets/pothole.jpg";
import rep2Fallback from "../assets/rep2.jpg";

export default function ContractorPortalPage() {
  const [availablePotholes, setAvailablePotholes] = useState<PotholeReport[]>([]);
  const [myWorks, setMyWorks] = useState<PotholeReport[]>([]);
  const [tab, setTab] = useState<"available" | "my-works">("available");
  const [selected, setSelected] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [uploadedFixImage, setUploadedFixImage] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"bounty" | "severity">("bounty");
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Fetch available & myWorks from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      const auth = await fetch("http://localhost:8080/api/check-auth", { credentials: "include" });
      if (!auth.ok) {
        window.location.href = "http://localhost:8080/login";
        return;
      }
      const [availRes, mineRes] = await Promise.all([
        fetch("http://localhost:8080/api/get-reports", { method: "POST", credentials: "include" }),
        fetch("http://localhost:8080/api/get-mywork", { credentials: "include" }),
      ]);
      setAvailablePotholes(await availRes.json());
      setMyWorks(await mineRes.json());
    } catch (e) {
      console.error(e);
      setError("Could not load reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Claim a pothole job
  const handleClaim = async () => {
    if (!claiming) return;
    try {
      setProcessing(true);
      const res = await fetch("http://localhost:8080/api/claim", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ reportId: claiming }),
      });
      if (!res.ok) throw new Error("Claim failed");

      // Optimistically move it locally
      const claimed = availablePotholes.find(p => p.id === claiming)!;
      const updated = { ...claimed, status: "in_progress" as const };
      setAvailablePotholes(prev => prev.filter(p => p.id !== claiming));
      setMyWorks(prev => [...prev, updated]);

      setClaiming(null);
      setTab("my-works");
      setSelected(null);
    } catch (e) {
      console.error(e);
      setError("Failed to claim job.");
    } finally {
      setProcessing(false);
    }
  };

  // Submit a repair image & verify
  const submitRepair = async (reportId: string) => {
    try {
      setProcessing(true);
      setError(null);
      setVerificationResult(null);

      // Decide on which image to send
      let afterFile: File;
      if (uploadedFixImage) {
        afterFile = uploadedFixImage;
      } else {
        const blob = await fetch(rep2Fallback).then(r => r.blob());
        afterFile = new File([blob], "repair-fallback.jpg", { type: blob.type });
      }

      // 1) Predict
      const form = new FormData();
      form.append("file", afterFile);
      const predictRes = await fetch("http://127.0.0.1:8000/predict", { method: "POST", body: form });
      const { count } = await predictRes.json();
      const isFixed = count === 0;
      setVerificationResult(isFixed);

      if (isFixed) {
        // 2) Notify backend
        const verifyRes = await fetch("http://localhost:8080/api/verify", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ reportId }),
        });
        if (!verifyRes.ok) throw new Error("Verification API failed");

        // Mark it completed locally
        setMyWorks(prev =>
          prev.map(w => w.id === reportId ? { ...w, status: "completed" as const } : w)
        );

        setUploadedFixImage(null);
        setSelected(null);
      }
    } catch (e) {
      console.error("Error in submitRepair:", e);
      setError("Unexpected error verifying repair.");
    } finally {
      setProcessing(false);
    }
  };

  // Safely derive the currently selected PotholeReport object (or null)
  const selectedPothole: PotholeReport | null = selected
    ? ((tab === "available" ? availablePotholes : myWorks).find(p => p.id === selected) ?? null)
    : null;

  // Filter & sort logic
  const filteredPotholes = (tab === "available" ? availablePotholes : myWorks)
    .filter(p => p.location.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "bounty":    return b.bounty - a.bounty;
        case "severity":  return b.severity.localeCompare(a.severity);
        default:          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contractor Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your repair jobs</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab("available")}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === "available"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Available Jobs
              </button>
              <button
                onClick={() => setTab("my-works")}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === "my-works"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                My Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Available */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Available Jobs</p>
                <p className="text-lg font-semibold">{availablePotholes.length}</p>
              </div>
            </div>
          </div>
          {/* In Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {myWorks.filter(w => w.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>
          {/* Completed */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {myWorks.filter(w => w.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
          {/* Total Earnings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ₹{myWorks.reduce((sum, w) => sum + (w.status === "completed" ? w.bounty : 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bounty">Bounty</option>
                  <option value="severity">Severity</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              </div>
              <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        ) : filteredPotholes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {tab === "available"
                ? "No available jobs match your criteria"
                : "You haven't claimed any jobs yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPotholes.map(pothole => (
              <div
                key={pothole.id}
                className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelected(pothole.id)}
              >
                <div className="aspect-video relative rounded-t-xl overflow-hidden">
                  {pothole.imageUrl ? (
                    <img
                      src={pothole.imageUrl}
                      alt="Pothole"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      pothole.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : pothole.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {pothole.status === "completed"
                      ? "Completed"
                      : pothole.status === "in_progress"
                      ? "In Progress"
                      : "Available"}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                        {pothole.location}
                      </h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        ₹{pothole.bounty}
                        </span>
                    </div>
                  </div>
                  

                  <div className="flex items-center justify-between mt-4">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        pothole.severity === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : pothole.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {pothole.severity} severity
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail / Submit modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {tab === "available" ? "Job Details" : "Submit Repair"}
                </h3>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

                     {/* Latitude & Longitude — right under the header */}
       {selectedPothole && (
         <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
           <p>Latitude: {selectedPothole.latitude}</p>
           <p>Longitude: {selectedPothole.longitude}</p>
         </div>
              )}
              

              {/* After-Repair picker */}
              {tab === "my-works" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">After-Repair Image:</label>
                  <ImageUpload onChange={file => setUploadedFixImage(file)} />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setSelected(null)} className="flex-1 px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                {tab === "available" ? (
                  <button
                    onClick={() => { setClaiming(selected); setSelected(null); }}
                    className="flex-1 bg-blue-600 text-white rounded-lg"
                  >
                    Claim Job
                  </button>
                ) : (
                  <button
                    onClick={() => submitRepair(selected!)}
                    disabled={!uploadedFixImage || processing}
                    className="flex-1 bg-green-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {processing ? "Verifying..." : "Submit Repair"}
                  </button>
                )}
              </div>

              {/* Verification banner */}
              {verificationResult !== null && (
                <div className={`mt-4 p-2 rounded ${
                  verificationResult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {verificationResult ? "👍 Repair looks good!" : "👎 Repair did NOT pass verification."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim confirmation modal */}
      {claiming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Confirm Claim
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Are you sure you want to claim this job?
                  </p>
                </div>
                <button onClick={() => setClaiming(null)} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setClaiming(null)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button
                  onClick={handleClaim}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Claiming...
                    </span>
                  ) : (
                    "Confirm Claim"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
