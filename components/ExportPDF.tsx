"use client";

import { motion } from "framer-motion";
import type { Task } from "@/lib/storage";
import { format, parseISO } from "date-fns";

interface ExportPDFProps {
  tasks: Task[];
  label?: string;
}

export default function ExportPDF({ tasks, label = "Export as PDF" }: ExportPDFProps) {
  async function handleExport() {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("Task Manager", 14, 20);

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(
      `Exported on ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}`,
      14,
      28
    );
    doc.text(`Total: ${tasks.length} tasks`, 14, 34);

    // Summary stats
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;
    doc.text(
      `Completed: ${completed} | Pending: ${pending}`,
      14,
      40
    );

    // Table
    const tableData = tasks.map((task) => [
      task.title,
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
      task.completed ? "Done" : "Pending",
      task.dueDate ? format(parseISO(task.dueDate), "MMM d, yyyy") : "-",
      format(parseISO(task.createdAt), "MMM d, yyyy"),
    ]);

    autoTable(doc, {
      startY: 46,
      head: [["Task", "Priority", "Status", "Due Date", "Created"]],
      body: tableData,
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [55, 65, 81],
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 22 },
        2: { cellWidth: 22 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });

    doc.save(`tasks-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleExport}
      disabled={tasks.length === 0}
      className="text-sm px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {label}
    </motion.button>
  );
}
