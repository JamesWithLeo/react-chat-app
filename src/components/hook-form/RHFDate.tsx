import { SelectProps, TextField, InputAdornment } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
interface RHFSelectProps extends Omit<SelectProps, "name"> {
	name: string;
	label?: string;
	helperText?: React.ReactNode;
}

export default function RHFDate({ name, label, helperText }: RHFSelectProps) {
	const { control } = useFormContext();

	return (
		<>
			<Controller
				name={name}
				defaultValue={""}
				control={control}
				render={({ field, fieldState }) => (
					<>
						<TextField
							{...field}
							fullWidth
							error={!!fieldState.error}
							helperText={
								fieldState.error
									? fieldState.error.message
									: helperText
							}
							label={label}
							type="date"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										Birth Date
									</InputAdornment>
								),
							}}
						/>
					</>
				)}
			/>
		</>
	);
}
