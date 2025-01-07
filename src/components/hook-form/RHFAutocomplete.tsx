import { useFormContext, Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

import { ReactNode } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function RHFAutocomplete({
	name,
	label,
	helperText,
	loading,
	options,
	...kwargs
}: {
	name: string;
	label: string;
	loading: boolean;
	options: any[];
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
					sx={{ overflow: "hidden" }}
					value={
						typeof field.value === "number" && field.value === 0
							? ""
							: field.value
					}
					onChange={(event, newValue) =>
						setValue(name, newValue, { shouldValidate: true })
					}
					//  error={!!error}
					options={options}
					disablePortal={true}
					onError={() => {}}
					{...kwargs}
					renderInput={(params) => (
						<TextField
							label={label}
							error={!!error}
							helperText={error ? error.message : helperText}
							{...params}
							InputProps={{
								...params.InputProps,
								endAdornment: loading ? (
									<>
										<CircularProgress size="20px" />
										{params.InputProps.endAdornment}
									</>
								) : null,
							}}
						/>
					)}
				/>
			)}
		/>
	);
}
