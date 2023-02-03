# ClassicWowPop
Website to display the statistics of the CensusPlusWotlk addon

## Deployment
```bash
cd client && npm install --only=dev && npm install && npm run build
cd .. && npm install
pm2 start ecosystem.config.js
```

## Environment variables
| Name                     | Default                            | Description                    |
|--------------------------|------------------------------------|--------------------------------|
| `PORT`                   | `5000`                             | The API port                   |
| `MONGO_URL`              | `mongodb://localhost:27017/census` | The MongoDB connection string  |
| `STORAGE_PATH`           | `/home/wowclas/storage`            | The path to the storage folder |
| `ADDON_VERSIONS_CURRENT` | `0.9.11`                           | Current addon version          |
| `ADDON_VERSIONS_VALID`   | `0.9.10,0.9.9,0.9.8`               | Other valid addon versions     |
