"use client";

import { Formik, Form, Field } from 'formik';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, Container, Typography, Box, Alert, AlertTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import Link from 'next/link';


const validate = (values: { title: string; description: string; status: string }) => {
  const errors: any = {};
  
  if (!values.title) {
    errors.title = 'Title is required';
  } else if (values.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  }

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (!values.status) {
    errors.status = 'Status is required';
  } else if (!validStatuses.includes(values.status)) {
    errors.status = 'Invalid status';
  }

  return errors;
};

interface TaskFormValues {
  title: string;
  description: string;
  status: string;
}

const createTask = () => {
  const [successMessage, setSuccessMessage] = useState(false);

  
const router = useRouter();
  const handleUpdateTask = async (values: TaskFormValues) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/tasks`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage(true);
    } catch (error: any) {
      console.warn('Error updating task:', error.message);
    }
  };

  return (
    <Container maxWidth="sm">
        {successMessage && (
          <div style={{position:"absolute",bottom:30, right:30}}>
        <Alert severity="success">
          <AlertTitle>Task Created!</AlertTitle>
          {successMessage}
        </Alert>
        </div>
      )}

<Link href="/tasklist" style={{position:"absolute", top:20, left:20}}>
      <HomeIcon fontSize='large'/>
      </Link>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        paddingX="20px"
      >
        <Typography variant="h4" gutterBottom>Create a Task</Typography>

        <Formik
          initialValues={{
            title: '',
            description: '',
            status: '',
          }}
          validate={validate}
          enableReinitialize={true}
          onSubmit={handleUpdateTask}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Field
                name="title"
                as={TextField}
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title ? errors.title : ''}
              />

              <Field
                name="description"
                as={TextField}
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description ? errors.description : ''}
              />

              <FormControl fullWidth margin="normal" error={touched.status && Boolean(errors.status)}>
                <InputLabel>Status</InputLabel>
                <Field
                  name="status"
                  as={Select}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Field>
                {touched.status && errors.status && (
                  <Typography color="error">{errors.status}</Typography>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '20px' }}
              >
                Create Task
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default createTask;
