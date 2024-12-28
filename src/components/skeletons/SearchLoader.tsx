import {
	Skeleton,
	Box,
	useTheme,
	useMediaQuery,
	Stack,
	Theme,
} from "@mui/material";

export default function SearchLoader() {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery((state: Theme) =>
		state.breakpoints.down("sm"),
	);
	return (
		<Box
			sx={{
				height: "100dvh",
				maxHeight: "100dvh",
				width: "100%",
				backgroundColor:
					theme.palette.mode === "light"
						? "#F8FAFF"
						: theme.palette.background.default,
			}}
		>
			<Stack p={isSmallScreen ? 2 : 3} spacing={2} width={"100%"}>
				<Stack direction={"row"} spacing={1}>
					{isSmallScreen && (
						<Skeleton
							variant="rounded"
							width={"2rem"}
							height={"3rem"}
						/>
					)}
					<Skeleton
						variant="rounded"
						height={"3rem"}
						width={"100%"}
					/>
				</Stack>
				<Stack direction={"row"} width={"100%"} spacing={3}>
					<Skeleton width={"3rem"} height={"4rem"} />
					<Skeleton width={"3rem"} height={"4rem"} />
					<Skeleton width={"3rem"} height={"4rem"} />
					<Skeleton width={"3rem"} height={"4rem"} />
				</Stack>
				<Box p={isSmallScreen ? 2 : 3}>
					<Skeleton width={"2rem"} />
				</Box>
			</Stack>
		</Box>
	);
}
