interface GenericFileIconProps {
  readonly ext: string;
}

export function PdfIcon() {
  return (
    <svg
      className="h-9 w-9 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4C4 2.89543 4.89543 2 6 2H16L22 8V20C22 21.1046 21.1046 22 20 22H6C4.89543 22 4 21.1046 4 20V4Z"
        className="fill-red-100 dark:fill-red-950/20 stroke-red-400 dark:stroke-red-500"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V8H22L16 2Z"
        className="fill-red-200 dark:fill-red-800 stroke-red-400 dark:stroke-red-500"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-red-700 dark:fill-red-300"
        fontSize="6.5"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        PDF
      </text>
    </svg>
  );
}

export function ExcelIcon() {
  return (
    <svg
      className="h-9 w-9 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4C4 2.89543 4.89543 2 6 2H16L22 8V20C22 21.1046 21.1046 22 20 22H6C4.89543 22 4 21.1046 4 20V4Z"
        className="fill-green-100 dark:fill-green-950/20 stroke-green-500 dark:stroke-green-600"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V8H22L16 2Z"
        className="fill-green-200 dark:fill-green-800 stroke-green-500 dark:stroke-green-600"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-green-700 dark:fill-green-300"
        fontSize="6.5"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        XLS
      </text>
    </svg>
  );
}

export function GenericFileIcon({ ext }: GenericFileIconProps) {
  return (
    <svg
      className="h-9 w-9 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4C4 2.89543 4.89543 2 6 2H16L22 8V20C22 21.1046 21.1046 22 20 22H6C4.89543 22 4 21.1046 4 20V4Z"
        className="fill-blue-100 dark:fill-blue-950/20 stroke-blue-400 dark:stroke-blue-500"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V8H22L16 2Z"
        className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-500"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-blue-700 dark:fill-blue-300"
        fontSize="6"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {ext.slice(0, 3)}
      </text>
    </svg>
  );
}
