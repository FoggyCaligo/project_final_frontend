"use client";

import { useEffect, useState } from "react";
import { initialMyPageData } from "./constants";
import { requestMyPageData } from "./mypageApi";

export function useMyPageData() {
  const [myPage, setMyPage] = useState(initialMyPageData);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMyPage() {
      const data = await requestMyPageData();

      if (ignore) {
        return;
      }

      setMyPage(data);
      setLoading(false);
    }

    loadMyPage();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const refresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  return { myPage, loading, refresh };
}
