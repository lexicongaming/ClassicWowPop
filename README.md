# ClassicWowPop
Website to display the statistics of the CensusPlusWotlk addon

## Deployment
```bash
cd client && npm install --only=dev && npm install && npm run build
cd .. && npm install
pm2 start ecosystem.config.js
```

## Environment variables
- `PORT` - The API port
- `MONGO_URL` - The MongoDB connection string
- `STORAGE_PATH` - The path to the storage folder
