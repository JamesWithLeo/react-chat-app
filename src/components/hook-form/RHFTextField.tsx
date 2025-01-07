import React from "react";
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField, TextFieldProps } from "@mui/material";

interface RHFTextFieldProps
	extends Omit<TextFieldProps, "name" | "helperText"> {
	name: string;
	label?: string;
	helperText?: React.ReactNode;
	autoFocus?: boolean;
}

export default function RHFTextField({
	name,
	helperText,
	...other
}: RHFTextFieldProps) {
	const { control } = useFormContext();
	return (
		<>
			<Controller
				name={name}
				control={control}
				defaultValue={""}
				render={({ field, fieldState: { error } }) => (
					<TextField
						{...field}
						autoFocus
						fullWidth
						error={!!error}
						helperText={error ? error.message : helperText}
						{...other}
					/>
				)}
			/>
		</>
	);
}
