const Spinner = () => (
  <div className="flex items-center w-screen h-screen justify-center">
    <svg
      style={{ margin: "auto", background: "none", display: "block", shapeRendering: "auto" }}
      width="154px"
      height="154px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        r="36"
        strokeWidth="5"
        stroke="#ffcb05"
        strokeDasharray="56.548667764616276 56.548667764616276"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="2.2222222222222223s"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  </div>
);

export default Spinner;
