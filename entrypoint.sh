#!/usr/bin/env bash
set -euo pipefail

function show_help {
    echo """
Commands
--------------------------------------------------------------------------------

bash | sh     : run shell
eval          : eval shell command
yarn          : yarn command



build         : create distributed assets
dev         : start  dev server
start       : start server

--------------------------------------------------------------------------------
"""
}


case "$1" in
    bash | sh )
        sh
    ;;

    eval )
        "${@:2}"
    ;;

    yarn )
        yarn "${@:2}"
    ;;



    build )
        yarn install --silent --frozen-lockfile
        yarn build
        # workaround to serve fonts from "/static/assets" url
    ;;

    dev )
        yarn dev
    ;;

    start )
        yarn start
    ;;

    * )
        show_help
    ;;
esac
