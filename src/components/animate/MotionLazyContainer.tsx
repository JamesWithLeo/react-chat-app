import PropTypes from "prop-types";
import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";

// ----------------------------------------------------------------------

// eslint-disable-next-line import/extensions
const loadFeatures = () => import("./features").then((res) => res.default);

MotionLazyContainer.propTypes = {
	children: PropTypes.node,
};

export default function MotionLazyContainer({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<LazyMotion strict features={loadFeatures}>
			{children}
		</LazyMotion>
	);
}
