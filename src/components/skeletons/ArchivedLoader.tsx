import {
	Box,
	Stack,
	useTheme,
	useMediaQuery,
	Theme,
	Typography,
	Skeleton,
} from "@mui/material";

export default function ArchivedLoader() {
	const theme = useTheme();

	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);

	return (
		<Box
			sx={{
				position: "relative",
				width: "100dvw",
				backgroundColor:
					theme.palette.mode === "light"
						? "#F8FAFF"
						: theme.palette.background.default,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
			}}
		>
			<Stack
				p={isSmallScreen ? 2 : 3}
				spacing={2}
				sx={{ height: "100vh" }}
			>
				<Stack spacing={2} direction={"row"} alignItems={"center"}>
					{isSmallScreen && (
						<Skeleton
							variant="rectangular"
							width={"2rem"}
							sx={{ borderRadius: 1 }}
							animation={false}
							height={"2rem"}
						/>
					)}
					<Typography variant="h1" width={"6rem"}>
						<Skeleton variant="text" />
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
}
