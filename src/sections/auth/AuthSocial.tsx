import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import React from "react";

const AuthSocial = () => {
	return (
		<div>
			<Divider
				sx={{
					my: 2.5,
					typography: "overline",
					color: "text.disabled",
					"&::before, ::after": {
						borderTopStyle: "dashed",
					},
				}}
			>
				OR
			</Divider>
			<Stack direction={"row"} justifyContent="center" spacing={2}>
				<IconButton>
					<GoogleLogo color="#DF3E30" />
				</IconButton>
				<IconButton color="inherit">
					<GithubLogo />
				</IconButton>
			</Stack>
		</div>
	);
};

export default AuthSocial;
