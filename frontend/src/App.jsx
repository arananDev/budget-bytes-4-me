// App.js
import { useState, useEffect } from 'react';
import RangeSlider from './components/RangeSlider';
import { Grid, Box, Button } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [initialRange, setInitialRange] = useState([]);
  const [values, setValues] = useState({});

  const handleSliderChange = (key, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: newValue,
    }));
  };

  const logValues = () => {
    const valuesToLog = Object.entries(values).map(([key, value]) => ({
      key,
      value,
    }));

    console.log(valuesToLog);
  };

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/api/get_boundaries')
      .then((response) => {
        setInitialRange(response.data);
        const defaultValues = {};
        response.data.forEach((item) => {
          defaultValues[item.key] = item.value;
        });
        setValues(defaultValues);
      })
      .catch((error) => {
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
        <Box position="absolute" top="5%" left="40%" textAlign="center">
          {initialRange.map(({ key, value }) => (
            <div key={key} style={{ width: '300px', margin: '10px auto' }}>
              <RangeSlider
                value={values[key] || value}
                min={value[0]}
                max={value[1]}
                onChange={(newValue) => handleSliderChange(key, newValue)}
                title={`Select ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}`}
              />
            </div>
          ))}
          <Box mt={4} mb={5} textAlign="center">
            <Button variant="contained" color="primary" onClick={logValues}>
              Log Values
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default App;
