import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Box } from '@mui/material';
import { m } from 'framer-motion';

// Define props interface for IconButtonAnimate
interface IconButtonAnimateProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large'; // MUI IconButton sizes
  [key: string]: any; // Allow any other props
}

// AnimateWrap component with props typing
const AnimateWrap: React.FC<{ size: string; children: React.ReactNode }> = ({ size, children }) => {
  const varSmall = {
    hover: { scale: 1.07 },
    tap: { scale: 0.97 },
  };

  const varMedium = {
    hover: { scale: 1.06 },
    tap: { scale: 0.98 },
  };

  const varLarge = {
    hover: { scale: 1.05 },
    tap: { scale: 0.99 },
  };

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(size === 'small' && varSmall) || (size === 'large' && varLarge) || varMedium}
      sx={{ display: 'inline-flex' }}
    >
      {children}
    </Box>
  );
};

// IconButtonAnimate component
const IconButtonAnimate = forwardRef<HTMLButtonElement, IconButtonAnimateProps>(
  ({ children, size = 'medium', ...other }, ref) => (
    <AnimateWrap size={size}>
      <IconButton size={size} ref={ref as React.Ref<HTMLButtonElement>} {...other}>
        {children}
      </IconButton>
    </AnimateWrap>
  )
);

// PropTypes for IconButtonAnimate (optional, for runtime type checking)
IconButtonAnimate.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default IconButtonAnimate;
