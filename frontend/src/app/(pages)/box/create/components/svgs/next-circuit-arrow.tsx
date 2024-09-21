import * as React from 'react';

const NextCircuitArrow = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.4}
      strokeWidth={1.5}
      d="m4 12 4-4-4-4M8 12l4-4-4-4"
    />
  </svg>
));

NextCircuitArrow.displayName = 'NextCircuitArrow';

export default NextCircuitArrow;
