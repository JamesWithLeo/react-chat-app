import { Stack, Skeleton, Divider, Box } from "@mui/material";

export default function LoginLoader() {
	return (
		<Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
			<Stack direction="row" spacing={0.5}>
				<Skeleton height={"3rem"} width={"8rem"} />
			</Stack>

			<Stack spacing={2}>
				<Skeleton variant="text" width={"10rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
			</Stack>

			<Stack sx={{ my: 2, gap: 2 }}>
				<Skeleton
					variant="text"
					width={"5rem"}
					sx={{ alignSelf: "end" }}
				/>

				<Skeleton variant="rounded" width={"100%"} height={"2.8rem"} />
			</Stack>

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
				<Stack direction={"row"} justifyContent="center" spacing={2}>
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
	);
}
