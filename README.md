# JavaScript Self Hosted Demo

This demo contains a NodeJS backend and React frontend which are linked to a self hosted PowerSync instance.

## Running

The `.env` file contains default configuration for the services. Reference this to connect to any services locally.

This demo can be started by running the following in this demo directory

```bash
docker compose up -d

cd schedule-app
pnpm dev
```

The frontend can be accessed at `http://localhost:5173` in a browser.

## Cleanup

The `setup.sql` script only runs on the first initialization of the container. Delete the container and volumes if making changes.
