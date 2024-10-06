import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormProvider from '../../components/hook-form/FormProvider';
import { Alert, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';

const RegisterForm = () => {

    const [isShowingPassword, setIsShowPassword] = useState<boolean>(false);
    const [isShowingConfirmPassword, setIsShowingConfirmPassword] = useState<boolean>(false)
    //validation rules 
    const registerSchema = Yup.object().shape({
      firstName:Yup.string().required('First Name is required'),
      lastName:Yup.string().required('Last Name is required'),
      email:Yup.string().required('Email is required').email('Email must be a valid email address'),
      password:Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword:Yup.string().required("Confirm your password").oneOf([Yup.ref("password")], "Password must match")
    });
  

    const methods = useForm({
      resolver: yupResolver(registerSchema),
    });
  
    const {reset, setError, handleSubmit, formState:{errors, }}
     = methods;
  
     const onSubmit = async () =>{
      try {
        console.log("create account")
      } catch (error) {
          console.log(error);
          reset();
          setError("root",{
              message: "error"
          })
      }
     }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
        {!!errors.email && <Alert severity='error'>{errors.email.message}</Alert>}
        <Stack direction={{xs:'column', sm:'row'}} spacing={2}>
            <RHFTextField name="firstName" label='First Name'/>
            <RHFTextField name="lastName" label='Last Name'/>
        </Stack>
        <RHFTextField name='email' label='Email address'/>
        <RHFTextField name='password' label='Password' type={isShowingPassword ? 'text' : 'password'}
        InputProps={
          {endAdornment: (
            <InputAdornment position="end">
            <IconButton onClick={()=>{
                setIsShowPassword(!isShowingPassword);
            }}>
                {isShowingPassword ? <Eye/>: <EyeSlash/>}
            </IconButton>
            </InputAdornment>
          )}
        }/>
        <RHFTextField name='confirmPassword' label='Confirm password' type={isShowingConfirmPassword ? 'text' : 'password'}
        InputProps={
          {endAdornment: (
            <InputAdornment position="end">
            <IconButton onClick={()=>{
                setIsShowingConfirmPassword(!isShowingConfirmPassword);
            }}>
                {isShowingConfirmPassword ? <Eye/>: <EyeSlash/>}
            </IconButton>
            </InputAdornment>
          )}
        }/>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800',
         '&:hover':{
            bgcolor:'text.primary',
            color:(theme)=> theme.palette.mode === 'light' ? 'common.white':'grey.800',
         }}}>Create Account</Button>
        </Stack>
        
    </FormProvider>
  )
}

export default RegisterForm