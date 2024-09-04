#!/bin/bash

docker compose down
docker compose up -d

pnpm dev
