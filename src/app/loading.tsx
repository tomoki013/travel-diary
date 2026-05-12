export default function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="loader-container">
        <svg className="paper-plane" viewBox="0 0 24 24">
          <path
            className="plane-body"
            d="M22 2L11 13"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="d"
              values="M22 2L11 13L2 9.5L5.5 22L22 2Z; M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8l-2 5h22l-2-5Z; M22 2L11 13L2 9.5L5.5 22L22 2Z"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <div className="trail"></div>
      </div>
      <p className="text-primary mt-6 animate-pulse text-lg font-semibold">
        最高の旅を計画しています...
      </p>
    </div>
  );
}
