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
	Stack,
} from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";

const NewPasswordForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	//validation rules
	const NewPasswordSchema = Yup.object().shape({
		newPassword: Yup.string()
			.min(6, "Password must be atleast 6 characters")
			.required("Password is required"),
		confirmPassword: Yup.string()
			.required("Password is required")
			.oneOf([Yup.ref("newPassword")], "Password must match"),
	});

	const defaultValues = {
		newPassword: "",
		confirmPassword: "",
	};

	const methods = useForm({
		resolver: yupResolver(NewPasswordSchema),
		defaultValues,
	});

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors },
	} = methods;

	const onSubmit = async () => {
		try {
			//submit data to backend
		} catch (error) {
			console.log(error);
			reset();
			setError("root", { message: "error" });
			// setError('afterSubmit',{
			//     ...error,
			//     message: error.message
			// })
		}
	};

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{!!errors.root && (
					<Alert severity="error">{errors.root.message}</Alert>
				)}

				<RHFTextField
					name="newPassword"
					label="New Password"
					type={showPassword ? "text" : "password"}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										setShowPassword(!showPassword);
									}}
								>
									{showPassword ? <Eye /> : <EyeSlash />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<RHFTextField
					name="confirmPassword"
					label="Confirm Password"
					type={showPassword ? "text" : "password"}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										setShowPassword(!showPassword);
									}}
								>
									{showPassword ? <Eye /> : <EyeSlash />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

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
					Submit
				</Button>
			</Stack>
		</FormProvider>
	);
};

export default NewPasswordForm;
