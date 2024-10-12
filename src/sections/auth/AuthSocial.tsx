import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import React from "react";
import { SigninGooglePopup } from "../../services/firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { SigninThunk, SignupThunk } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";

const AuthSocial = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	async function HandleSigninGoogle() {
		const response = await SigninGooglePopup();
		const { user, isNewUser } = { ...response };
		if (!user || !user?.email) {
			return;
		}
		const email = user.email;
		const uid = user.uid;
		const firstName = null;
		const lastName = null;
		console.log("new user:", isNewUser);
		if (isNewUser) {
			const photoUrl = user.photoURL;
			const phoneNumber = user.phoneNumber;
			dispatch(
				SignupThunk({
					email,
					uid,
					photoUrl,
					phoneNumber,
					firstName,
					lastName,
				}),
			)
				.unwrap()
				.then((data) => {
					console.log(data);
					navigate("/");
				});
		} else {
			dispatch(SigninThunk({ email, uid }))
				.unwrap()
				.then((data) => {
					console.log(data);
					navigate("/");
				});
		}
	}
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
				<IconButton onClick={HandleSigninGoogle}>
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
