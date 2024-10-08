import React from "react";
import {
	FormProvider as RHFFormProvider,
	UseFormReturn,
} from "react-hook-form";

interface FormProviderProps {
	children: React.ReactNode;
	onSubmit: () => void; // Adjust the type if your onSubmit function takes parameters
	methods: UseFormReturn<any>; // Replace 'any' with your form data type if applicable
}

const FormProvider: React.FC<FormProviderProps> = ({
	children,
	onSubmit,
	methods,
}) => {
	return (
		<RHFFormProvider {...methods}>
			<form onSubmit={onSubmit}>{children}</form>
		</RHFFormProvider>
	);
};

export default FormProvider;
