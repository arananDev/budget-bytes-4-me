import { useState } from 'react';
import { Slider, Typography, Grid, Box } from '@mui/material';

const RangeSlider = ({ min, max, title }) => {
  const [range, setRange] = useState([min, max])

  const handleRangeChange = (event, newValue) => {
    setRange(newValue);
  };

  return (
    <Box mb={2}>
      <div style={{ width: 300 }}>
        <Typography id="range-slider" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <div className="range-slider-container">
              <div className="range-bar" style={{ width: `300px`, marginLeft: `${range[0]}%` }} />
              <Slider
                value={range}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={min}
                max={max}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default RangeSlider;
