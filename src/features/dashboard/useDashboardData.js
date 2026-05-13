"use client";

import { useEffect, useState } from "react";
import { initialDashboardData } from "./constants";
import {
  requestDashboardBaseData,
  requestDashboardRecommendations,
} from "./dashboardApi";

export function useDashboardData() {
  const [dashboard, setDashboard] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      const baseData = await requestDashboardBaseData();

      if (ignore) {
        return;
      }

      setDashboard(baseData);
      setLoading(false);

      const recommendationData = await requestDashboardRecommendations();

      if (ignore) {
        return;
      }

      setDashboard((current) => ({
        ...current,
        ...recommendationData,
        errors: [...current.errors, ...recommendationData.errors],
      }));
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  return { dashboard, loading, refresh };
}

