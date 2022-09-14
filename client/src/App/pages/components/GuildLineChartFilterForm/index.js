import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

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
    width: 300
  },
  button: {
    '&:hover': {
      color: '#DC143C',
      textShadow: '0 0 1px hsl(0, 0%, 40%)'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 150
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

export default function FilterForm({ realmOptions, guildOptions, onChange }) {
  const classes = useStyles();

  const [selectedRealm, setSelectedRealm] = React.useState('');
  const [selectedGuild, setSelectedGuild] = React.useState('');
  const [selectedDateFrom, setSelectedDateFrom] = React.useState('');
  const [selectedDateTo, setSelectedDateTo] = React.useState('');

  function handleRealmChange(event) {
    setSelectedRealm(event.target.value);
  }
  function handleGuildChange(event) {
    setSelectedGuild(event.target.value);
  }

  function handleDateFromChange(event) {
    const newDateFrom = event.target.value;
    // switch the fields if dateTo < dateFrom
    if (selectedDateTo !== '' && new Date(selectedDateTo) < new Date(newDateFrom)) {
      setSelectedDateFrom(selectedDateTo);
      setSelectedDateTo(newDateFrom);
    } else {
      setSelectedDateFrom(newDateFrom);
    }
  }

  function handleDateToChange(event) {
    const newDateTo = event.target.value;
    // switch the fields if dateFrom >  dateTo
    if (selectedDateFrom !== '' && new Date(selectedDateFrom) > new Date(newDateTo)) {
      setSelectedDateTo(selectedDateFrom);
      setSelectedDateFrom(newDateTo);
    } else {
      setSelectedDateTo(newDateTo);
    }
  }

  function handleResetClick() {
    setSelectedRealm([]);
    setSelectedGuild([]);
    setSelectedDateFrom('');
    setSelectedDateTo('');
    onChange({});
  }

  function handleApplyClick() {
    const query = {};
    if (selectedRealm !== '') {
      query.realm = selectedRealm.label;
    }
    if (selectedGuild !== '') {
      query.guild = selectedGuild.label;
    }
    if (selectedDateFrom !== '') {
      query.dateFrom = selectedDateFrom;
    }
    if (selectedDateTo !== '') {
      query.dateTo = selectedDateTo;
    }
    onChange(query);
  }

  return (
    <form className={classes.root} autoComplete="ON">
      <div className="form-wrapper box-wrapper filter-form">
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="realm-filter">Realm</InputLabel>
            <Select
              value={selectedRealm}
              onChange={handleRealmChange}
              input={<Input id="realm-filter" name="realm" />}
              MenuProps={MenuProps}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {realmOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.labelClean}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="guild-filter">Guild</InputLabel>
            <Select 
            value={selectedGuild} 
            onChange={handleGuildChange} 
            input={<Input id="guild-filter" name="guild" />}
            MenuProps={MenuProps}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {guildOptions.map(element => (
                <MenuItem key={element.value} value={element}>
                  {element.labelClean}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: 10 }}>
          <TextField
            id="dateFrom"
            label="From"
            type="date"
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            id="dateTo"
            label="To"
            type="date"
            value={selectedDateTo}
            onChange={handleDateToChange}
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
        <div>
          <Button className={classes.button} onClick={handleResetClick}>
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
