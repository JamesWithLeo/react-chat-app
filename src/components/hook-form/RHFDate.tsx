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
				control={control}
				render={({ field, fieldState }) => (
					<>
						<TextField
							{...field}
							fullWidth
							error={!!fieldState.error}
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
