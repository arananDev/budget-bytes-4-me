// App.js
import { useState, useEffect } from 'react';
import RangeSlider from './components/RangeSlider';
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

const App = () => {
  const [initialRange, setInitialRange] = useState([]);
  const [values, setValues] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);

  const handleSliderChange = (key, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: newValue,
    }));
  };

  const getData = () => {
    setLoading(true)
    const filtersToLog = Object.entries(values).map(([key, value]) => ({
      key,
      value,
    }));

    axios.get('http://127.0.0.1:5000/api/get_data', {params: {data: JSON.stringify(filtersToLog)}})
    .then((response) => {
      setData(response.data)
      setOpenDialog(true);
    }).catch((error)=> {
      console.error('Error fetching data:', error);
    }).finally(()=> {
      console.log(data)
      setLoading(false)
    })
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

  const columnDefs = [
    { headerName: 'Recipe URL', field: 'url', cellRendererFramework: (params) => (<Link href={params.value} target="_blank" rel="noopener noreferrer">
    {params.value}</Link> )},
    { headerName: 'Prep Time (mins)', field: 'prep_time_mins' },
    { headerName: 'Cook Time (mins)', field: 'cook_time_mins' },
    { headerName: 'Total Time (mins)', field: 'total_time_mins' },
    { headerName: 'Servings', field: 'servings' },
    { headerName: 'Protein per Serving (grams)', field: 'protien_per_serving_grams' },
    { headerName: 'Carbs per Serving (grams)', field: 'carbs_per_serving_grams' },
    { headerName: 'Calories per Serving (kcal)', field: 'calories_per_serving_kcal' },
    { headerName: 'Fat per Serving (grams)', field: 'fat_per_serving_grams' },
    { headerName: 'Sodium per Serving (mg)', field: 'sodium_per_serving_mg' },
    { headerName: 'Fiber per Serving (mg)', field: 'fiber_per_serving_mg' },
    { headerName: 'Ingredients', field: 'ingredients_for_servings_size' },
  ];

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh'}}
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
            {loading ? (<CircularProgress/>)
            : (
            <Button variant="contained" color="primary" onClick={getData}>
              Log Values
            </Button>
            )}
          </Box>
        </Box>
      </Grid>
      <Dialog 
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xl" // Set the maxWidth to 'xl' to make the dialog span the whole page
        fullWidth 
      >
        <DialogTitle>AG-Grid</DialogTitle>
        <DialogContent>
          {data.length > 0 && (
            <div className="ag-theme-alpine" style={{ height: '400px', width: '100%', overflowX: 'auto' }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={data}
                domLayout='autoHeight'
                onFirstDataRendered={(params) => {
                  params.api.sizeColumnsToFit();
                }}
                defaultColDef={{
                  flex: 1,
                  minWidth: 150,
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default App;
