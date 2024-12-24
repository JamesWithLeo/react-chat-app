import { Skeleton, useTheme } from "@mui/material";

export default function ConvoCardSkeleton({ opacity }: { opacity?: number }) {
	const theme = useTheme();
	return (
		<Skeleton
			variant="rectangular"
			animation="wave"
			sx={{
				width: "100%",
				opacity: opacity,
				borderRadius: 1,
				height: "100%",
				maxHeight: "5rem",
				backgroundColor:
					theme.palette.mode === "light"
						? "#fff"
						: theme.palette.background.default,
			}}
		></Skeleton>
	);
}
