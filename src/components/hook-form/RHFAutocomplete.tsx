import { useFormContext, Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { ReactNode } from "react";

export default function RHFAutocomplete({
	name,
	label,
	helperText,
	...kwargs
}: {
	name: string;
	label: string;
	helperText: ReactNode;
	[key: string]: any;
}) {
	const { control, setValue } = useFormContext();
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState: { error } }) => (
				<Autocomplete
					{...field}
					fullWidth
					value={
						typeof field.value === "number" && field.value === 0
							? ""
							: field.value
					}
					onChange={(event, newValue) =>
						setValue(name, newValue, { shouldValidate: true })
					}
					//  error={!!error}
					options={[]}
					onError={() => {}}
					{...kwargs}
					renderInput={(params) => (
						<TextField
							label={label}
							error={!!error}
							helperText={error ? error.message : helperText}
							{...params}
						/>
					)}
				/>
			)}
		/>
	);
}
