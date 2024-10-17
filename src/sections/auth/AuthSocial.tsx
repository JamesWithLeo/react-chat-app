import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import React from "react";
import { SigninWithPopup } from "../../services/firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { setError, SigninThunk, SignupThunk } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";

const AuthSocial = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	async function HandleSigninGoogle() {
		const response = await SigninWithPopup("google.com");
		if (!response) return;

		// handle account exist with different credential --
		if (!response.user && response.isNewUser === false) {
			dispatch(setError("Signin with google instead"));
			return;
		}

		const { user, isNewUser } = { ...response };
		if (!user || !user?.email) return;

		const email = user.email;
		const uid = user.uid;
		const photoUrl = user.photoURL;
		const phoneNumber = user.phoneNumber;
		const firstName = null;
		const lastName = null;

		if (isNewUser) {
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
			dispatch(SigninThunk({ uid }))
				.unwrap()
				.then((data) => {
					console.log(data);
					navigate("/");
				});
		}
	}

	async function HandleSigninGithub() {
		const response = await SigninWithPopup("github.com");
		if (!response) return;

		// handle account exist with different credential --
		if (!response.user && response.isNewUser === false) {
			dispatch(setError("Sign-in with google instead"));
			HandleSigninGoogle();
			return;
		}

		const { user, isNewUser } = { ...response };
		if (!user || !user?.email) return;

		const email = user.email;
		const uid = user.uid;
		const photoUrl = user.photoURL;
		const phoneNumber = user.phoneNumber;
		const firstName = null;
		const lastName = null;

		if (isNewUser) {
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
			dispatch(SigninThunk({ uid }))
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
				<IconButton onClick={HandleSigninGoogle} id="googleButton">
					<GoogleLogo color="#DF3E30" />
				</IconButton>
				<IconButton color="inherit" onClick={HandleSigninGithub}>
					<GithubLogo />
				</IconButton>
			</Stack>
		</div>
	);
};

export default AuthSocial;
