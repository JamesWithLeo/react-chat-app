import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import { Button, Stack, TextField } from "@mui/material";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFSelect from "../../components/hook-form/RHFSelect";
import RHFDate from "../../components/hook-form/RHFDate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../redux/store";
import { Navigate, useNavigate } from "react-router-dom";
import { SetupThunk } from "../../redux/slices/auth";

export type Gender = "male" | "female" | "others";

const genderOptions: { value: Gender; label: string }[] = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "Female" },
	{ value: "others", label: "Others" },
];
interface ISetupSchema {
	firstName: string;
	lastName: string;
	birthDate: Date;
	gender: Gender;
}

const today = new Date();
const eighteenYearsAgo = new Date(
	today.getFullYear() - 18,
	today.getMonth(),
	today.getDate(),
);

export default function SetupForm() {
	const user = useSelector((state: AppState) => state.auth.user);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const setupSchema = Yup.object().shape({
		firstName: Yup.string().required("First name is required"),
		lastName: Yup.string().required("Last name is required"),
		gender: Yup.string()
			.oneOf(genderOptions.map((option) => option.value))
			.required("Gender is required"),
		birthDate: Yup.date()
			.max(eighteenYearsAgo, "You must be at least 18 years old")
			.required("Birth date is required"),
	});

	const methods = useForm({
		resolver: yupResolver(setupSchema),
	});
	const { handleSubmit } = methods;

	const submitSetup: SubmitHandler<ISetupSchema> = async (data) => {
		if (!user) return;
		dispatch(SetupThunk({ email: user.email, ...data }))
			.unwrap()
			.then((result) => {
				console.log("Updated values:", result);
				navigate("/", { replace: true });
			});
	};

	if (!user || !user.email || !user.uid || !user.id) {
		return <Navigate to={"/signin"} replace />;
	}
	if (
		user &&
		user.firstName &&
		user.lastName &&
		user.gender &&
		user.birthDate
	) {
		return <Navigate to={"/"} replace />;
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(submitSetup)}>
			<Stack spacing={3}>
				<TextField
					name="email"
					label="email"
					value={"jamesocampogi04@gmail.com"}
					disabled
				></TextField>

				<RHFTextField name="firstName" label="First Name" />
				<RHFTextField name="lastName" label="Last Name" />
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
					<RHFDate name="birthDate" />
					<RHFSelect
						name="gender"
						label="gender"
						options={genderOptions}
						defaultValue={"others"}
					/>
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
					Finish setup
				</Button>
			</Stack>
		</FormProvider>
	);
}
