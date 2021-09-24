/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-octal-escape */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Helmet } from 'react-helmet';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Spinner from './components/Spinner';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const Contribute = () => {
  const classes = useStyles();

  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadFinished, setIsUploadFinished] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState({});
  const [error, setError] = React.useState(false);
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [addonVersion, setAddonVersion] = React.useState(false);

  const sendRequest = (file, cb) => {
    const xhr = new window.XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        cb(xhr.response);
      }
    };

    const formData = new FormData();
    formData.append('file', file, file.name);

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const handleOnChange = e => {
    setError(false);
    setIsUploading(true);
    sendRequest(e.target.files[0], data => {
      const json = JSON.parse(data);
      setIsUploading(false);
      if (json.hasOwnProperty('error')) {
        setError(json.error);
        return;
      }
      if (json.updateDialog) {
        setDialogOpen(true);
        setAddonVersion(json.updateDialog);
      }
      setUploadResult(json);
      setIsUploadFinished(true);
    });
  };

  let ErrorPanel;
  if (error) {
    ErrorPanel = <span className="error">{error}</span>;
  }

  let UploadPanel;
  if (!isUploadFinished && !isUploading) {
    UploadPanel = (
      <div>
        {ErrorPanel}
        <h2>Upload data</h2>
        <p>Select your CensusPlusTBC.lua (instruction see above)</p>
        <input
          accept=".lua"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={handleOnChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" className={classes.button}>
            Upload
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </label>
      </div>
    );
  }

  let SpinnerPanel;
  if (isUploading) {
    SpinnerPanel = (
      <div>
        <h2>Processing your data</h2>
        <p>Depending on your uploaded file size this may take a while</p>
        <Spinner width={200} height={200} color="#442317" />
      </div>
    );
  }

  let UploadFinishedPanel;
  if (isUploadFinished && Object.keys(uploadResult).length > 0) {
    UploadFinishedPanel = (
      <div>
        <h2 className="highlight">Thanks for submitting!</h2>
        <h3>Stats</h3>
        <p>Characters processed: {uploadResult.charStats.processed}</p>
        <p>Characters inserted: {uploadResult.charStats.inserted}</p>
        <p>Characters updated: {uploadResult.charStats.updated}</p>
        <p>Activity datasets inserted: {uploadResult.timeStats.inserted}</p>
      </div>
    );
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const description =
    'How to upload census data to the Wow Classic Pop and how to install the CensusPlusTBC addon.';
  const title = 'How to contribute to the Wow Classic Pop census project';

  return (
    <div className="App">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <title>{title}</title>
      </Helmet>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Outdated addon version detected</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your are using an outdated version of the CensusPlusClassic addon. Please upgrade to the
            latest{' '}
            <a href="https://www.curseforge.com/wow/addons/censusplustbc" target="blank">
              CensusPlusTBC v{addonVersion}
            </a>{' '}
            and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <h1>Data submission instructions</h1>
      <div className="box-wrapper normal">
        <h2>How to collect census data</h2>
        <ol>
          <li>
            Download the CensusPlusTBC addon from{' '}
            <a
              href="https://www.curseforge.com/wow/addons/censusplustbc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>{' '}
            or{' '}
            <a
              href="https://www.curseforge.com/wow/addons/censusplustbc"
              target="_blank"
              rel="noopener noreferrer"
            >
              CurseForge
            </a>
          </li>
          <li>
            Use an unzipping propram like{' '}
            <a href="https://www.7-zip.org/" target="_blank" rel="noopener noreferrer">
              7zip
            </a>{' '}
            and extract the CensusPlusTBC folder to your addons directory
          </li>
          <li>
            The addon directory is usually located here:
            <br />
            <strong>C:\Program Files\World of Warcraft\_classic_\Interface\AddOns</strong>
          </li>
          <li>
            When you log into the game the CensusPlusTBC addon automatically starts collecting
            data. You can watch the progress through the minimap icon.
          </li>
          <li>
            After the census is taken you get a message in chat how many characters were recorded
          </li>
          <li>Logout or do a /reload to force the addon to write its data into the *.lua file</li>
          <li>
            Navigate to{' '}
            <strong>
              C:\Program Files\World of Warcraft\_classic_\WTF\Account\YOUR_ACCOUNT\SavedVariables\
            </strong>{' '}
            and find the <strong>CensusPlusTBC.lua</strong>
          </li>
          <li>
            Upload the <strong>CensusPlusTBC.lua</strong> through the upload button below
          </li>
        </ol>
      </div>
      <div className="box-wrapper normal upload">
        {SpinnerPanel}
        {UploadPanel}
        {UploadFinishedPanel}
      </div>
      <div className="discord-cta">
        <a href="https://discord.gg/DjcXKtKr88" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon size="7x" icon={faDiscord} />
          <p>
            Join the <br /> project <br /> discord
          </p>
        </a>
      </div>
    </div>
  );
};

export default Contribute;
