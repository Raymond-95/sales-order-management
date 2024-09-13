#!/bin/sh

if [ "$ENV" = "dev" ]; then
    exec npm run dev
else
    exec npm run prod
fi
