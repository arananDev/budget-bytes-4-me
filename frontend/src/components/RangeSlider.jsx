// RangeSlider.js
import { Slider, Typography, Box } from '@mui/material';

const RangeSlider = ({ value, min, max, onChange, title }) => {
  const handleRangeChange = (_, newValue) => {
    onChange(newValue);
  };

  return (
    <Box mb={2}>
      <div style={{ width: 300 }}>
        <Typography id="range-slider" gutterBottom>
          {title}
        </Typography>
        <div className="range-slider-container">
          <Slider
            value={value}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={min}
            max={max}
          />
        </div>
      </div>
    </Box>
  );
};

export default RangeSlider;
