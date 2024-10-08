import { m } from "framer-motion";
// @mui
import { Box } from "@mui/material";
//
import { varContainer } from "./variants/container";
import { ReactNode } from "react";

export default function MotionContainer({
	animate,
	action = false,
	children,
	...other
}: {
	animate: boolean;
	action: boolean;
	children: ReactNode;
}) {
	if (action) {
		return (
			<Box
				component={m.div}
				initial={false}
				animate={animate ? "animate" : "exit"}
				variants={varContainer()}
				{...other}
			>
				{children}
			</Box>
		);
	}

	return (
		<Box
			component={m.div}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={varContainer()}
			{...other}
		>
			{children}
		</Box>
	);
}
