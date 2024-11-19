import React from 'react';

interface ProjectFiltersProps {
  onStatusFilter: (status: string) => void;
}

export function ProjectFilters({ onStatusFilter }: ProjectFiltersProps) {
  return (
    <div className="flex justify-end mb-6 bg-white p-4 rounded-lg shadow-sm">
      <select
        onChange={(e) => onStatusFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="on-hold">On Hold</option>
      </select>
    </div>
  );
}