"use client";

import { Formik, Form, Field } from 'formik';
import { Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const isExpired = payload.exp * 1000 < Date.now(); 
  
      if (isExpired) {
        localStorage.removeItem('authToken');
      } else {
        router.push('/tasklist');
      }
    }
  }, [router]);

  const handleRegister = async (
    values: { username: string; email: string; password: string; confirmPassword: string },
    { setErrors }: { setErrors: (errors: any) => void } 
  ) => {
    const errors: { username?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!values.username) {
      errors.username = 'Username is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(values.email)) {
        errors.email = 'Invalid email format';
      }
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/register', values);
        localStorage.setItem('authToken', response.data.token);
        setSuccessMessage('Registration successful!');
        setError('');
        router.push('/tasklist');
      
      
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { error: errorCode } = err.response.data;
        if(errorCode === 'u_e_not_unique'){
          setError('Username or email is already taken')
        }
      }
      else {
        setError('Login failed due to some server issues.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Head>
        <title>Register - Task Management</title>
      </Head>
      <Container className={styles.container}>
        <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
          Task Management Application Register
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography color="primary">{successMessage}</Typography>}

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={handleRegister}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit} className={styles.form}>
              <Field
                name="username"
                as={TextField}
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                className={styles.field}
                error={touched.username && !!errors.username} 
                helperText={touched.username && errors.username}
              />
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
              <Field
                name="confirmPassword"
                type="password"
                as={TextField}
                label="Confirm Password"
                variant="outlined"
                fullWidth
                margin="normal"
                className={styles.field}
                error={touched.confirmPassword && !!errors.confirmPassword} 
                helperText={touched.confirmPassword && errors.confirmPassword} 
              />
              <Button type="submit" variant="contained" color="primary" fullWidth className={styles.button}>
                Register
              </Button>
            </Form>
          )}
        </Formik>
        <div className={styles.loginLink}>
          <Typography variant="body2">
            Already a user?{' '}
            <Link href="/login" passHref>
              <Button color="primary" variant='text'>Login</Button>
            </Link>
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default Register;
