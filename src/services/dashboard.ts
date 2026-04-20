/**
 * Dashboard service — fetches KPI metrics and chart data from the backend.
 * Falls back to empty/zero values when the backend is unavailable so the
 * UI renders cleanly without crashing.
 */

import { api } from "@/services/api";

export interface DayMetric {
  day: string;
  calls: number;
  answered: number;
}

export interface AdminMetrics {
  kpi: {
    total: number;
    answered: number;
    missed: number;
    voicemails: number;
  };
  weekly: DayMetric[];
}

export interface RadarMetric {
  subject: string;
  A: number;
}

export interface StaffMetrics {
  summary: {
    total: number;
    resolved: number;
    in_progress: number;
    new: number;
    score: number;
  };
  radar: RadarMetric[];
}

const EMPTY_ADMIN: AdminMetrics = {
  kpi: { total: 0, answered: 0, missed: 0, voicemails: 0 },
  weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    calls: 0,
    answered: 0,
  })),
};

const EMPTY_STAFF: StaffMetrics = {
  summary: { total: 0, resolved: 0, in_progress: 0, new: 0, score: 0 },
  radar: [
    { subject: "Response Time", A: 0 },
    { subject: "Task Completion", A: 0 },
    { subject: "Follow-ups", A: 0 },
    { subject: "Notes Quality", A: 0 },
    { subject: "Punctuality", A: 0 },
  ],
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  try {
    return await api.get<AdminMetrics>("/api/dashboard/metrics");
  } catch (err) {
    console.warn("[Dashboard] admin metrics unavailable, using empty state.", err);
    return EMPTY_ADMIN;
  }
}

export async function getStaffMetrics(): Promise<StaffMetrics> {
  try {
    return await api.get<StaffMetrics>("/api/dashboard/staff-metrics");
  } catch (err) {
    console.warn("[Dashboard] staff metrics unavailable, using empty state.", err);
    return EMPTY_STAFF;
  }
}
