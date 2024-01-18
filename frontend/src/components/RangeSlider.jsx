// RangeSlider.js
import { Slider, Typography, Box } from '@mui/material';

const RangeSlider = ({ value, min, max, onChange, title }) => {
  const handleRangeChange = (_, newValue) => {
    onChange(newValue);
  };

  // Custom format function for value label
  const valueLabelFormat = (value) => {
    return value === max ? `${value}+` : value;
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
            valueLabelFormat={valueLabelFormat}
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
