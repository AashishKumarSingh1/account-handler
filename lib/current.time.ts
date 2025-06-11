"use client"
import { useEffect, useState } from 'react';

const useCurrentDate = (updateInterval = 1000) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [updateInterval]);

  return currentDate;
};

export default useCurrentDate;