import { Box, Skeleton, Stack, useTheme } from "@mui/material";

export default function ConvoSkeleton() {
	const theme = useTheme();
	return (
		<Box
			sx={{
				width: "100%",
				borderRadius: 1,
				height: "5rem",
			}}
			component={"span"}
		>
			<Skeleton
				height={"100%"}
				animation="pulse"
				variant="rectangular"
				sx={{
					backgroundColor:
						theme.palette.mode === "light"
							? theme.palette.common.white
							: theme.palette.background.default,
				}}
			/>
		</Box>
	);
}
