import { jsPDF } from "jspdf";
import type { StatementExportData } from "./statementExport";

// Browser-only: drawn with jsPDF and saved via the browser's download flow,
// so customer data never leaves the client. Loaded through a dynamic import
// to keep jsPDF out of the initial bundle.

const ZINC_900: [number, number, number] = [24, 24, 27];
const ZINC_500: [number, number, number] = [113, 113, 122];
const ZINC_200: [number, number, number] = [228, 228, 231];
const VIOLET: [number, number, number] = [139, 92, 246];

const PAGE_MARGIN = 48;

async function fetchLogoDataUrl(): Promise<string | null> {
  try {
    const blob = await fetch("/logo.png").then((r) =>
      r.ok ? r.blob() : Promise.reject(new Error(String(r.status))),
    );
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // the PDF is still valid without the logo image
    return null;
  }
}

export async function exportStatementPdf(
  data: StatementExportData,
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  // Header: logo tile + wordmark + document title
  const logo = await fetchLogoDataUrl();
  if (logo) {
    doc.addImage(logo, "PNG", PAGE_MARGIN, y, 40, 40);
  }
  doc.setTextColor(...ZINC_900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Ophelos", PAGE_MARGIN + (logo ? 52 : 0), y + 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...ZINC_500);
  doc.text("Financial overview", PAGE_MARGIN + (logo ? 52 : 0), y + 33);
  y += 60;

  doc.setDrawColor(...VIOLET);
  doc.setLineWidth(2);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + contentWidth, y);
  y += 28;

  // Period + status
  doc.setTextColor(...ZINC_900);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(data.periodLabel, PAGE_MARGIN, y);
  doc.setFontSize(11);
  doc.setTextColor(...VIOLET);
  doc.text(data.statusLabel, PAGE_MARGIN + contentWidth, y, {
    align: "right",
  });
  y += 24;

  // Totals row
  const totals = [
    ["Income", data.totals.income],
    ["Regular outgoings", data.totals.outgoings],
    ["Remaining income", data.totals.remaining],
  ] as const;
  const colWidth = contentWidth / totals.length;
  totals.forEach(([label, value], i) => {
    const x = PAGE_MARGIN + i * colWidth;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...ZINC_500);
    doc.text(label, x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...ZINC_900);
    doc.text(value, x, y + 17);
  });
  y += 40;

  const paragraph = (text: string, size: number, color: readonly number[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, PAGE_MARGIN, y);
    y += lines.length * size * 1.35 + 10;
  };

  paragraph(data.explanation, 11, ZINC_900);
  paragraph(data.trendLine, 10, ZINC_500);
  y += 8;

  // Breakdown: income and outgoings item tables
  const itemSection = (
    title: string,
    items: { label: string; amount: string }[],
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...ZINC_500);
    doc.text(title.toUpperCase(), PAGE_MARGIN, y);
    y += 14;
    if (items.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Nothing recorded this month.", PAGE_MARGIN, y);
      y += 18;
      return;
    }
    for (const item of items) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...ZINC_900);
      doc.text(item.label, PAGE_MARGIN, y);
      doc.text(item.amount, PAGE_MARGIN + contentWidth, y, { align: "right" });
      doc.setDrawColor(...ZINC_200);
      doc.setLineWidth(0.5);
      doc.line(PAGE_MARGIN, y + 5, PAGE_MARGIN + contentWidth, y + 5);
      y += 18;
    }
    y += 10;
  };

  itemSection("Income", data.incomeItems);
  itemSection("Regular outgoings", data.expenditureItems);

  // Disclaimer footer
  y += 6;
  doc.setDrawColor(...ZINC_200);
  doc.setLineWidth(0.5);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + contentWidth, y);
  y += 16;
  paragraph(data.disclaimer, 8, ZINC_500);

  doc.save(data.fileName);
}
