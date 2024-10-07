import React, { forwardRef } from 'react';
import { m } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box, Fab } from '@mui/material';
import { Theme } from '@emotion/react';

// ----------------------------------------------------------------------

interface FabButtonAnimateProps {
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  theme: Theme;
  sx?: React.CSSProperties;
  sxWrap?: React.CSSProperties;
  [key: string]: any; // Allows additional props
}

const FabButtonAnimate = forwardRef<HTMLButtonElement, FabButtonAnimateProps>(
  ({ color = 'primary', size = 'large', children, sx, sxWrap, ...other }, ref) => {
    const theme = useTheme();

    const commonFabProps = {
      ref,
      size,
      sx,
      ...other,
    };

    if (color === 'default' || color === 'inherit' || color === 'primary' || color === 'secondary') {
      return (
        <AnimateWrap size={size} sxWrap={sxWrap}>
          <Fab {...commonFabProps} color={color}>
            {children}
          </Fab>
        </AnimateWrap>
      );
    }

    return (
      <AnimateWrap size={size} sxWrap={sxWrap}>
        <Fab
          {...commonFabProps}
          sx={{
            boxShadow: theme.shadows[color],
            color: theme.palette.primary,
            bgcolor: theme.palette.primary,
            '&:hover': {
              bgcolor: theme.palette.grey[900],
            },
            ...sx,
          }}
        >
          {children}
        </Fab>
      </AnimateWrap>
    );
  }
);

export default FabButtonAnimate;

// ----------------------------------------------------------------------

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

// Define props for AnimateWrap
interface AnimateWrapProps {
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  sxWrap?: React.CSSProperties;
}

function AnimateWrap({ size, children, sxWrap }: AnimateWrapProps) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: 'inline-flex',
        ...sxWrap,
      }}
    >
      {children}
    </Box>
  );
}
