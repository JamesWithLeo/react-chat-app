import React , { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from '@mui/material';
import { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { Link as RouterLink } from 'react-router-dom';

const LoginForm = () => {

  const [showPassword, setShowPassword] = useState(false);

  //validation rules 
  const loginSchema = Yup.object().shape({
    email:Yup.string().required('Email is required').email('Email must be a valid email address'),
    password:Yup.string().required('Password is required')
  });

  const defaultValues = {
    email:'dulanjali.JamesOcampo@gmail.com',
    password:'dula@123'
  };

  const methods = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues
  });
  
  const {reset, setError, handleSubmit, formState:{errors,}}
   = methods;

   const onSubmit = async () =>{
        try {
            //submit data to backend
        } catch (error) {
            console.log(error);
            reset();
            setError("email", {message: "wrong", } )
            
            // setError('afterSubmit',{
            //     ...error,
            //     message: error.message
            // })
        }
   }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
            {!!errors.email && <Alert severity='error'>{errors.email.message}</Alert>}
        
        <RHFTextField name='email' label='Email address'/>
        <RHFTextField name='password' label='Password' type={showPassword ? 'text' : 'password'}
        InputProps={{
         startAdornment: (
            <InputAdornment position="start" component="div">
                        $
                    </InputAdornment>
         ), 
         endAdornment: (
          <InputAdornment position="end">
          <IconButton onClick={()=>{
              setShowPassword(!showPassword);
          }}>
              {showPassword ? <Eye/>: <EyeSlash/>}
          </IconButton>
          </InputAdornment>
         )
        }
      }/>
        </Stack>
        <Stack alignItems={'flex-end'} sx={{my:2}}>
            <Link component={RouterLink} to='/auth/reset-password'
             variant='body2' color='inherit' underline='always'>Forgot Password?</Link>
        </Stack>
        <Button fullWidth color='inherit' size='large' type='submit' variant='contained'
        sx={{bgcolor:'text.primary', color:(theme)=> theme.palette.mode === 'light' ?
         'common.white':'grey.800',
         '&:hover':{
            bgcolor:'text.primary',
            color:(theme)=> theme.palette.mode === 'light' ? 'common.white':'grey.800',
         }}}>Login</Button>
    </FormProvider>
  )
}

export default LoginForm