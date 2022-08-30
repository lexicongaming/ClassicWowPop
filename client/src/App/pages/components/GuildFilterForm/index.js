import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import './index.css';

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

  const [selectedLastDays, setSelectedLastDays] = React.useState('');

  function handleLastDaysChange(event) {
    setSelectedLastDays(event.target.value);
  }

  function resetForm() {
    setSelectedLastDays('');
    onChange({});
  }

  function handleApplyClick() {
    const query = {};

    if (selectedLastDays !== '') {
      query.lastDays = selectedLastDays;
    }
    onChange(query);
  }

  return (
    <form className={classes.root} autoComplete="off">
      <div className="form-wrapper box-wrapper filter-form">
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="lastDays-filter">Last days</InputLabel>
            <Select
              value={selectedLastDays}
              onChange={handleLastDaysChange}
              inputProps={{
                name: 'lastDays',
                id: 'lastDays-filter'
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
          <Button className={classes.button} onClick={resetForm}>
            Reset
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.outlinedPrimary}
            onClick={handleApplyClick}
          >
            Show guilds
          </Button>
        </div>
      </div>
    </form>
  );
}
