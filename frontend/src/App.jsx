import { useState, useEffect } from 'react';
import RangeSlider from './components/RangeSlider';
import { Grid, Box } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [initialRange, setInitialRange] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/get_boundaries')
      .then(response => {
        setInitialRange(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box
          position="absolute"
          top="5%"
          left="40%"
          textAlign="center"
        >
          {initialRange.map(({ key, value }) => (
            <div key={key} style={{ width: '300px', margin: '10px auto' }}>
              <RangeSlider
                min={value[0]}
                max={value[1]}
                title={`Select ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}`}
              />
            </div>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default App;
