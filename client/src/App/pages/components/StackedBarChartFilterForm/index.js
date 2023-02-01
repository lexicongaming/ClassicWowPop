import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import './index.css';
import './sliderRailFix.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  slider: {
    width: 300,
    color: 'rgba(0, 0, 0, 0.54)',
    '&:hover': {
      thumb: 'box-shadow: 0px 0px 0px 8px #000'
    }
  },
  button: {
    '&:hover': {
      color: '#DC143C',
      textShadow: '0 0 1px hsl(0, 0%, 40%)'
    }
  },
  outlinedPrimary: {
    border: '1px solid #D7CB83',
    color: '#D7CB83',
    '&:hover': {
      border: '1px solid #000',
      textShadow: '0 0 1px black',
      color: '#9ACD32',
      backgroundColor: 'rgba(233, 135, 70, 0.08);'
    }
  }
}));

export default function StackedBarChartFilterForm({ onChange }) {
  const classes = useStyles();

  const [selectedLevel, setSelectedLevel] = React.useState([1, 80]);
  const [selectedLastSeen, setSelectedLastSeen] = React.useState('');

  function handleLevelChange(event, newValue) {
    setSelectedLevel(newValue);
  }

  function handleLastSeenChange(event) {
    setSelectedLastSeen(event.target.value);
  }

  function resetForm() {
    setSelectedLevel([1, 80]);
    setSelectedLastSeen('');
    onChange({});
  }

  function handleApplyClick() {
    const query = {};
    const [minLevel, maxLevel] = selectedLevel;
    if (minLevel !== 1) {
      query.minLevel = minLevel;
    }
    if (maxLevel !== 80) {
      query.maxLevel = maxLevel;
    }
    if (selectedLastSeen !== '') {
      query.lastSeen = selectedLastSeen;
    }
    onChange(query);
  }

  return (
    <form className={classes.root} autoComplete="off">
      <div className="form-wrapper box-wrapper filter-form">
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="lastSeen-filter">Last Seen</InputLabel>
            <Select
              value={selectedLastSeen}
              onChange={handleLastSeenChange}
              inputProps={{
                name: 'lastSeen',
                id: 'lastSeen-filter'
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="7">
                <em>Last 7 Days</em>
              </MenuItem>
              <MenuItem value="14">
                <em>Last 14 Days</em>
              </MenuItem>
              <MenuItem value="30">
                <em>Last 30 Days</em>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <Typography id="range-slider" gutterBottom>
            Level Range
          </Typography>
          <Slider
            className={classes.slider}
            value={selectedLevel}
            onChange={handleLevelChange}
            valueLabelDisplay="auto"
            classes={{ rail: 'fix-slider-rail' }}
            max={80}
            min={1}
          />
        </div>
        <div>
          <Button className={classes.button} onClick={resetForm}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.outlinedPrimary}
            onClick={handleApplyClick}
          >
            Show stats
          </Button>
        </div>
      </div>
    </form>
  );
}
