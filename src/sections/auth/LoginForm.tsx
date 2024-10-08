import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Alert,
	Button,
	IconButton,
	InputAdornment,
	Link,
	Stack,
} from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";

interface ICredential {
	email: string;
	password: string;
}
const LoginForm = () => {
	const [isShowingPassword, setIsShowingPassword] = useState(false);

	const loginSchema = Yup.object().shape({
		email: Yup.string()
			.required("Email is required")
			.email("Email must be a valid email address"),
		password: Yup.string().required("Password is required"),
	});

	const methods = useForm({
		resolver: yupResolver(loginSchema),
		shouldFocusError: true,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, submitCount },
	} = methods;

	const onSubmit = async (data: ICredential) => {
		try {
			console.log(submitCount);
			console.log(data);

			throw new Error("Incorrect password");
		} catch (error) {
			reset();
			setError("password", { message: "Incorrect password" });
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={2}>
				{errors.email && (
					<Alert severity="error">{errors.email.message}</Alert>
				)}
				{errors.password && !errors.email && (
					<Alert severity="error">{errors.password.message}</Alert>
				)}

				<RHFTextField name="email" label="Enter your email" />

				<RHFTextField
					name="password"
					label="Enter your password"
					type={isShowingPassword ? "text" : "password"}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										setIsShowingPassword(
											!isShowingPassword,
										);
									}}
								>
									{isShowingPassword ? <Eye /> : <EyeSlash />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			<Stack alignItems={"flex-end"} sx={{ my: 2 }}>
				<Link
					component={RouterLink}
					to="/auth/reset-password"
					variant="caption"
					color="inherit"
					fontSize={"6"}
					underline="hover"
				>
					Forgot Password?
				</Link>
			</Stack>
			<Button
				fullWidth
				color="inherit"
				size="large"
				type="submit"
				variant="contained"
				sx={{
					bgcolor: "text.primary",
					color: (theme) =>
						theme.palette.mode === "light"
							? "common.white"
							: "grey.800",
					"&:hover": {
						bgcolor: "text.primary",
						color: (theme) =>
							theme.palette.mode === "light"
								? "common.white"
								: "grey.800",
					},
				}}
			>
				Login
			</Button>
		</FormProvider>
	);
};

export default LoginForm;
