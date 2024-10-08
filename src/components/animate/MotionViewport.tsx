import PropTypes from "prop-types";
import { m } from "framer-motion";
// @mui
import { Box } from "@mui/material";
// hooks
import useResponsive from "../../hooks/useResponsive";
//
// import { varContainer } from '.';
import breakpoints from "../../theme/breakpoints";

// ----------------------------------------------------------------------

MotionViewport.propTypes = {
	children: PropTypes.node.isRequired,
	disableAnimatedMobile: PropTypes.bool,
};

export default function MotionViewport({
	children,
	disableAnimatedMobile,
	...other
}: {
	children: React.ReactNode;
	disableAnimatedMobile: boolean;
}) {
	const isMobile = useResponsive(
		"down",
		"sm",
		breakpoints.values.xs,
		breakpoints.values.sm,
	);

	if (isMobile && disableAnimatedMobile) {
		return <Box {...other}>{children}</Box>;
	}

	return (
		<Box
			component={m.div}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true, amount: 0.3 }}
			// variants={varContainer()}
			{...other}
		>
			{children}
		</Box>
	);
}
