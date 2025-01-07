import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	DialogContent,
	DialogTitle,
	Modal,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import React, { SyntheticEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import useSearchContext from "../../contexts/SearchContext";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/store";
import { debounce } from "lodash";

const CreateGroupForm = ({ handleClose }: { handleClose: () => void }) => {
	const { searchData, setSearchQuery, isSuccess, isLoading, setScope } =
		useSearchContext();
	const id = useSelector((state: AppState) => state.auth.user?.id);
	const NewGroupSchema = Yup.object().shape({
		title: Yup.string().required("Title is required"),
		members: Yup.array().min(2, "Must have at least 2 members"),
	});

	const defaultValues = {
		title: "",
		members: [],
	};

	const methods = useForm({
		resolver: yupResolver(NewGroupSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = methods;

	const onSubmit = async (data: any) => {
		try {
			//api call
			console.log("New group date:", data);
		} catch (error) {
			console.log(error);
		}
	};
	const handleDebounceSearch = debounce((value) => {
		setScope("people");
		setSearchQuery(value);
	}, 800);

	useEffect(() => {
		if (isSubmitSuccessful) {
			handleClose();
		}
	}, [isSubmitSuccessful, handleClose]);

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3} pt={2}>
				<RHFTextField
					name="title"
					autoFocus={true}
					label="Title"
					helperText={
						<>
							<Typography>{errors.title?.message}</Typography>
						</>
					}
				/>
				<RHFAutocomplete
					name="members"
					label="Members"
					noOptionsText="No members"
					loading={isLoading}
					helperText={
						<>
							<Typography variant="caption">
								{errors.members?.message}
							</Typography>
						</>
					}
					freeSolo={true}
					autoHighlight
					clearOnBlur
					multiple
					sx={{ mt: 3 }}
					filterOptions={(x: any) => x}
					getOptionLabel={(option: {
						id: string;
						firstName: string;
						lastName: string;
					}) => `${option.firstName} ${option.lastName}`}
					getOptionDisabled={(option: {
						id: string;
						firstName: string;
						lastName: string;
					}) => option.id === id}
					options={
						isSuccess && Array.isArray(searchData.users)
							? searchData.users.map((filteredUser) => ({
									id: filteredUser.id,
									firstName: filteredUser.firstName,
									lastName: filteredUser.lastName,
								}))
							: []
					}
					onInputChange={(
						event: SyntheticEvent<Element, Event>,
						value: string,
						reason: "input" | "reset" | "clear",
					) => {
						if (reason === "input") {
							handleDebounceSearch(value);
						}
					}}
					ChipProps={{ size: "medium" }}
				/>
				<Stack
					spacing={2}
					direction="row"
					alignItems="center"
					justifyContent="end"
				>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isSubmitting}
					>
						Create
					</Button>
				</Stack>
			</Stack>
		</FormProvider>
	);
};

const CreateGroup = ({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) => {
	const theme = useTheme();
	return (
		<>
			<Modal open onClose={handleClose}>
				<Box
					maxWidth={"sm"}
					minWidth={"xs"}
					width={"100%"}
					sx={{
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						borderRadius: 3,
						bgcolor: theme.palette.background.paper,
						position: "fixed",
						zIndex: theme.zIndex.modal + 1,
					}}
				>
					<DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>
					{/* Content */}
					<DialogContent
						sx={{
							overflowY: "hidden",
						}}
					>
						<CreateGroupForm handleClose={handleClose} />
					</DialogContent>
				</Box>
			</Modal>
		</>
	);
};

export default CreateGroup;
