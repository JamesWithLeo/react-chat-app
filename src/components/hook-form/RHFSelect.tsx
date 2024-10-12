import { SelectProps, MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
interface RHFSelectProps extends Omit<SelectProps, "name"> {
	name: string;
	label?: string;
	defaultValue: string | number;
	helperText?: React.ReactNode;
	options: { value: string | number; label: string }[];
}

export default function RHFSelect({
	name,
	label,
	options,
	helperText,
	defaultValue,
}: RHFSelectProps) {
	const { control } = useFormContext();

	return (
		<>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				render={({ field, fieldState }) => (
					<>
						<TextField
							{...field}
							fullWidth
							error={!!fieldState.error}
							label={label}
							select
						>
							{options.map((option, index) => (
								<MenuItem value={option.value} key={index}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</>
				)}
			/>
		</>
	);
}
