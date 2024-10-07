interface VarContainerProps {
  staggerIn?: number;  // Optional property for staggerIn duration
  delayIn?: number;     // Optional property for delayIn duration
  staggerOut?: number;  // Optional property for staggerOut duration
}

export const varContainer = (props?: VarContainerProps) => {
  const staggerIn = props?.staggerIn || 0.05;
  const delayIn = props?.delayIn || 0.05;   // Fixed to use delayIn
  const staggerOut = props?.staggerOut || 0.05; // Fixed to use staggerOut

  return {
    animate: {
      transition: {
        staggerChildren: staggerIn,
        delayChildren: delayIn,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerOut,
        staggerDirection: -1,
      },
    },
  };
};
