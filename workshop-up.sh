#!/bin/bash

docker compose up -d
corepack enable
pnpm install
pnpm dev
