"use client"

import { Button, Card, CardActions,SelectChangeEvent, CardContent, Container, Typography, CircularProgress, Pagination, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styles from "../page.module.css";
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';


interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;
  const [totalTasks, setTotalTasks] = useState(0);
  const [username, setUsername] = useState("Loading...");
  const [statusFilter, setStatusFilter] = useState<string>(''); 
  const [notfound, setNotFound] = useState(false);

  
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.user.username);
        if (!response.data.valid) {
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } catch (error: any) {
        console.warn('Error validating token:', error.message);
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);

  
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: tasksPerPage,
            status: statusFilter, 
          },
        });
        setTasks(response.data.tasks);
        setTotalTasks(response.data.totalCount);
        setNotFound(false)
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response) {
          const { error: errorCode } = err.response.data;
          if (errorCode === 'no_tasks') {
            setNotFound(true);
          }
          else{
        console.warn('Error fetching tasks:', err.message);
      }
      }
    } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentPage, statusFilter]); 

  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };

  const deleteTask = async (taskId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push("/login")
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.reload();
    } catch (error: any) {
      console.warn('Error deleting task:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6">Loading tasks...</Typography>
      </div>
    );
  }

  return (
    <>
    <Link href="/create">
    <Button
    style={{zIndex:9999}}
      variant="contained"
      color="primary"
      className={styles.createTask}
    ><AddIcon fontSize='large'/>
    </Button>
    </Link>
      <div className={styles.topBar}>
        <Typography variant="h6" className={styles.left}>Welcome, {username}</Typography>
        <Button variant="contained" color="secondary" className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Container maxWidth="lg" className={styles.mainContainer}>
        <div className={styles.filterContainer}>
          {}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
  {notfound ? (
    <Typography variant="h6" style={{ textAlign: 'center', margin: '20px 0' }}>
      No Tasks
    </Typography>
  ) : (
    <>
      <div className={styles.cardContainer}>
        {tasks.map((task) => (
          <div className={styles.cardWrapper} key={task.id}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6" className={styles.cardTitle}>
                  {task.title}
                </Typography>
                <Typography variant="body2" className={styles.cardDescription}>
                  {task.description}
                </Typography>
                <Typography
                  variant="body1"
                  className={
                    task.status === 'completed'
                      ? styles.completedStatus
                      : task.status === 'in_progress'
                      ? styles.inproStatus
                      : styles.pendingStatus
                  }
                >
                  Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Typography>
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button size="small" variant="contained" color="primary" className={styles.button}>
                  <Link href={`/change/${task.id}`} passHref>
                    Update
                  </Link>
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  className={styles.button}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className={styles.paginationContainer}>
        <Pagination
          count={Math.ceil(totalTasks / tasksPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </>
  )}
</div>

      </Container>
    </>
  );
};

export default Dashboard;
