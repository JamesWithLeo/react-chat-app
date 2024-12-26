import {
	Box,
	IconButton,
	Skeleton,
	Stack,
	Theme,
	useMediaQuery,
	useTheme,
} from "@mui/material";

export default function GeneralChatLoader() {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down("sm"),
	);
	return (
		<>
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
					pb={0}
					spacing={2}
					sx={{ height: "100vh" }}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack
							spacing={2}
							direction={"row"}
							alignItems={"center"}
						>
							{isSmallScreen && (
								<Skeleton
									variant="rectangular"
									width={"2rem"}
									sx={{ borderRadius: 1 }}
									animation={false}
									height={"2rem"}
								/>
							)}
							<Skeleton
								variant="text"
								width={"6rem"}
								height={"2rem"}
								sx={{ marginLeft: "2rem" }}
							/>
						</Stack>
						<IconButton>
							<Skeleton
								variant="circular"
								height={"2rem"}
								width={"2rem"}
							/>
						</IconButton>
					</Stack>

					<Stack sx={{ width: "100%" }}>
						<Skeleton
							variant="rectangular"
							height={"2rem"}
							sx={{
								borderRadius: 20,
							}}
						/>
					</Stack>

					<Stack spacing={2.4}>
						<Skeleton variant="text" width={"5rem"} />
					</Stack>
				</Stack>
			</Box>
		</>
	);
}
