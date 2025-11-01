#!/usr/bin/env bash

# This script can be used to generate an ".env" for local development with
# docker compose.
#
# Example:
# ./scripts/secrets.sh [--silent | -s]

function check_openssl {
    which openssl > /dev/null
}

function gen_random_string {
    openssl rand -hex 16 | tr -d "\n"
}

function gen_env {
    cat << EOF


VITE_APP_SERVER_DOMAIN=https://api.gogrub.co/api
# VITE_APP_SERVER_DOMAIN=https://troox-backend-new.onrender.com/api
VITE_APP_PAYMENT_DOMAIN=https://staging.troopay.co/api/v1


# VITE_APP_SERVER_DOMAIN=https://gogrub-backend.onrender.com/api
#VITE_APP_PAYMENT_DOMAIN=https://payment.trootab.com/api/v1
#VITE_APP_SERVER_DOMAIN=https://troox-backend-new-gamma.vercel.app/api
#VITE_APP_SERVER_DOMAIN=https://troox-backend-new.vercel.app/api
# VITE_APP_CLOUD_NAME='dslqlq4po'
# VITE_APP_PRESET_KEY='ml_default'

NODE_ENV=production


EOF
}


check_openssl
RET=$?
if [ $RET -eq 1 ]; then
    echo "Please install 'openssl' >  https://www.openssl.org/"
    exit 1
fi

set -Eeuo pipefail

silent="no"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --silent | -s )
            silent="yes"
            shift
        ;;

        * )
            shift
        ;;
    esac
done





gen_env > .env