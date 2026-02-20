"use client";

import { Eye, Edit, Trash2 } from "lucide-react";

interface JobTableRowProps {
  title: string
  department: string
  type: string
  status: "Live" | "Draft" | "Closed"
  applicants: number
  newApplicants?: number
  datePosted: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const statusConfig = {
  Live: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  Draft: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  Closed: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-700 dark:text-slate-300",
  },
};

export default function JobTableRow({
  title,
  department,
  type,
  status,
  applicants,
  newApplicants,
  datePosted,
  onView,
  onEdit,
  onDelete,
}: JobTableRowProps) {
  const config = statusConfig[status];

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-[#cfdbe7] dark:border-slate-800 last:border-0">
      {/* Job Info */}
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="font-bold text-sm">{title}</span>
          <span className="text-xs text-[#4c739a] dark:text-slate-400">
            {department} · {type}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config.bg} ${config.text}`}
        >
          {status}
        </span>
      </td>

      {/* Applicants */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{applicants}</span>
          {newApplicants && newApplicants > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold">
              {newApplicants} New
            </span>
          )}
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-5 text-sm text-[#4c739a] dark:text-slate-400">
        {datePosted}
      </td>

      {/* Actions */}
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onView}
            title="View"
            className="p-2 rounded-lg hover:bg-primary/10 text-slate-600 dark:text-slate-300 hover:text-primary transition"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={onEdit}
            title="Edit"
            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-600 dark:text-slate-300 hover:text-amber-600 transition"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={onDelete}
            title="Delete"
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
