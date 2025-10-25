"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: Record<string, number>;
};

export default function ScansChart({ data }: Props) {
  const { categories, seriesData } = useMemo(() => {
    const days = 7;
    const cats: string[] = [];
    const vals: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      cats.push(label);
      vals.push(data?.[key] ?? 0);
    }
    return { categories: cats, seriesData: vals };
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 220,
      toolbar: { show: false },
      animations: { enabled: true },
      fontFamily: "Inter, ui-sans-serif, system-ui",
    },
    colors: ["#194dbe"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.6,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: { left: 10, right: 10 },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
      axisBorder: { color: "#e5e7eb" },
      axisTicks: { color: "#e5e7eb" },
    },
    yaxis: {
      min: 0,
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `${val} scans` },
    },
  };

  const series = [{ name: "Scans", data: seriesData }];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="area" height={220} />
    </div>
  );
}