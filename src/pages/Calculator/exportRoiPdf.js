import jsPDF from "jspdf";
import Chart from "chart.js/auto";

const formatLei = (value) => {
  const n = Number(value || 0);
  return `${n.toLocaleString("ro-RO")} lei`;
};

const formatKwh = (value) => {
  const n = Number(value || 0);
  return `${n.toLocaleString("ro-RO")} kWh`;
};

const formatDateRo = (d = new Date()) =>
  d.toLocaleString("ro-RO", { year: "numeric", month: "long", day: "2-digit" });

const loadImageAsDataUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
};

function buildChartImage({
  totalInvestment,
  monthlySavings,
  years = 10,
  width = 1000,
  height = 520,
}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const labels = Array.from({ length: years }, (_, i) => `Anul ${i + 1}`);
  const yearlySavings = Number(monthlySavings || 0) * 12;
  const cumulative = labels.map((_, i) => yearlySavings * (i + 1));
  const investLine = labels.map(() => Number(totalInvestment || 0));

  const chart = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Economii cumulate",
          data: cumulative,
          tension: 0.25,
          pointRadius: 3,
        },
        {
          label: "Investitie totala",
          data: investLine,
          borderDash: [8, 6],
          tension: 0,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Economii cumulate vs investitie (10 ani)",
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${Number(ctx.raw || 0).toLocaleString(
                "ro-RO",
              )} lei`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `${Number(v).toLocaleString("ro-RO")} lei`,
          },
        },
      },
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);
  chart.destroy();
  return imgData;
}

export async function exportRoiPdf({
  roiInstallCost,
  roiPanelCost,
  roiBatteryCost,
  roiMonthlySavings,
  roiMonthlyProduction,
  roiResult,
}) {
  const install = Number(roiInstallCost || 0);
  const panel = Number(roiPanelCost || 0);
  const battery = Number(roiBatteryCost || 0);
  const totalInvestment = install + panel + battery;

  const logoData = await loadImageAsDataUrl(
    `${window.location.origin}/logo_descriptiv.png`
  );

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;

  if (logoData) {
    const logoSize = 56;
    doc.addImage(logoData, "PNG", pageW - margin - logoSize, 30, logoSize, logoSize);
  }

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Raport ROI - Sistem Fotovoltaic", margin, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Data: ${formatDateRo()}`, margin, 84);

  // Separator
  doc.setDrawColor(210);
  doc.setLineWidth(1);
  doc.line(margin, 98, pageW - margin, 98);

  // Bloc Input
  let y = 130;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Date introduse", margin, y);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const rows = [
    ["Cost total instalare", formatLei(install)],
    ["Cost panouri solare", formatLei(panel)],
    ["Cost baterii (optional)", formatLei(battery)],
    ["Economii lunare estimate", formatLei(roiMonthlySavings)],
    ["Productie lunara estimata", formatKwh(roiMonthlyProduction)],
    ["Investitie totala (calculata)", formatLei(totalInvestment)],
  ];

  const col1 = margin;
  const col2 = pageW - margin;

  rows.forEach(([k, v]) => {
    doc.text(k, col1, y);
    doc.setFont("helvetica", "bold");
    doc.text(v, col2, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 18;
  });

  // Bloc Rezultat
  y += 10;
  doc.setDrawColor(235);
  doc.line(margin, y, pageW - margin, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Rezultat", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const paybackText = roiResult?.payback ?? "-";
  const tenYearText = roiResult?.tenYearSavings ?? "-";

  doc.text("Recuperarea investitiei:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(String(paybackText), pageW - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 18;

  doc.text("Economii totale in 10 ani:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(String(tenYearText), pageW - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  y += 26;

  // Grafic
  const chartImg = buildChartImage({
    totalInvestment,
    monthlySavings: Number(roiMonthlySavings || 0),
    years: 10,
  });

  const imgW = pageW - margin * 2;
  const imgH = (imgW * 520) / 1000;

  if (y + imgH + 60 > pageH) {
    doc.addPage();
    y = 64;
  }

  doc.addImage(chartImg, "PNG", margin, y, imgW, imgH);

  // Footer
  const footerY = pageH - 36;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Generat automat din calculatorul ROI", margin, footerY);

  const fileName = `raport-roi-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
