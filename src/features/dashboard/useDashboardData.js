"use client";

import { useEffect, useState } from "react";
import { initialDashboardData } from "./constants";
import { requestDashboardData } from "./dashboardApi";

export function useDashboardData() {
  const [dashboard, setDashboard] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      const data = await requestDashboardData();

      if (ignore) {
        return;
      }

      setDashboard(data);
      setLoading(false);
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

