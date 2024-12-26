import { Stack, Skeleton, Box, Divider } from "@mui/material";
export default function RegisterLoader() {
	return (
		<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
			<Stack spacing={"1rem"}>
				<Skeleton height={"3rem"} width={"15rem"} />
				<Skeleton variant="text" width={"10rem"} />
			</Stack>

			<Stack direction={{ xs: "column", sm: "row" }} spacing={2.8}>
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
			</Stack>
			<Stack spacing={2.8}>
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
			</Stack>

			<Stack>
				<Skeleton
					variant="text"
					width={"60%"}
					sx={{ alignSelf: "center" }}
				/>

				<Box>
					<Divider
						sx={{
							my: 2.5,
							typography: "overline",
							color: "text.disabled",
							"&::before, ::after": {
								borderTopStyle: "dashed",
							},
						}}
					></Divider>
					<Stack
						direction={"row"}
						justifyContent="center"
						spacing={2}
					>
						<Skeleton
							variant="circular"
							width={"2rem"}
							height={"2rem"}
						/>

						<Skeleton
							variant="circular"
							width={"2rem"}
							height={"2rem"}
						/>
					</Stack>
				</Box>
			</Stack>
		</Stack>
	);
}
