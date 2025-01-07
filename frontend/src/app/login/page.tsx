"use client";

import { Formik, Form, Field } from 'formik';
import { Button, TextField, Typography } from '@mui/material';
import styles from "../page.module.css";
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/tasklist');
    }
  }, [router]);

  const handleLogin = async (
    values: { email: string; password: string },
    { setFieldError }: { setFieldError: (field: string, message: string) => void }
  ) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      console.log('Login successful, token stored:', token);
      router.push('/tasklist');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const { error: errorCode } = error.response.data;
        
        if (values.email === '') {
          setFieldError('email', 'Email cannot be empty');
        }
        else if (values.password === '') {
          setFieldError('password', 'Password cannot be empty');
        }
        else if (values.password.length < 6) {
          setFieldError('password', 'Password should atleast have 6 characters');
        }
        else if (errorCode === 'bad_creds' || errorCode === 'user_nf') {
          setFieldError('email', 'Invalid Email or Password');
          setFieldError('password', 'Invalid Email or Password');
        } 
        else if(errorCode === 'token_exp'){
          localStorage.removeItem("authToken")
          router.push("/login")
        }
        else {
          console.error('Login failed with server response:', error.response.data);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
          Task Management Application Login
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, actions) => handleLogin(values, actions)}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit} className={styles.form}>
              <Field
                name="email"
                as={TextField}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                className={styles.field}
                error={touched.email && !!errors.email} 
                helperText={touched.email && errors.email}
              />
              <Field
                name="password"
                type="password"
                as={TextField}
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                className={styles.field}
                error={touched.password && !!errors.password} 
                helperText={touched.password && errors.password} 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth className={styles.button}>
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <div className={styles.loginLink}>
          <Typography variant="body2">
            New User?{' '}
            <Link href="/" passHref>
              <Button color="primary" variant="text">Register</Button>
            </Link>
          </Typography>
        </div>
      </div>
    </>
  );
};

export default Login;
