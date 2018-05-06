#!/bin/bash
set -ex
docker build -t kopiro/kopiro .
docker push kopiro/kopiro