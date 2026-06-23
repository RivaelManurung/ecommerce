import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  borderBottom = true,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  borderBottom?: boolean;
}) {
  return (
    <div
      className={`-mx-6 -mt-6 mb-6 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-start sm:justify-between ${
        borderBottom ? "border-b border-gray-200" : ""
      }`}
    >
      <div>
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
