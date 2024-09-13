#!/bin/sh

if [ "$ENV" = "dev" ]; then
    echo 'npm run dev'
    exec npm run dev
else
    echo 'npm run prod'
    exec npm run prod
fi
