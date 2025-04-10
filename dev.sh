#!/bin/bash
set -ex
npm run fetch-data
npm run generate
npm run serve ./public