#!/bin/bash

sudo docker compose up -d
corepack enable
pnpm install
pnpm dev
