interface TransitionProps {
	duration?: number; // Optional duration for hover transition
	ease?: number[]; // Optional easing function for hover transition
	durationIn?: number; // Optional duration for enter transition
	easeIn?: string; // Optional easing function for enter transition
	durationOut?: number; // Optional duration for exit transition
	easeOut?: number[]; // Optional easing function for exit transition
}

export const varTranHover = (props: TransitionProps) => {
	const duration = props?.duration || 0.32;
	const ease = props?.ease || [0.43, 0.13, 0.23, 0.96];

	return { duration, ease };
};

export const varTranEnter = (props: TransitionProps) => {
	const duration = props?.durationIn || 0.64;
	const ease = props?.easeIn || [0.43, 0.13, 0.23, 0.96];

	return { duration, ease };
};

export const varTranExit = (props: TransitionProps) => {
	const duration = props?.durationOut || 0.48;
	const ease = props?.easeOut || [0.43, 0.13, 0.23, 0.96];

	return { duration, ease };
};
