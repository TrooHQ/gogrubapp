#!/usr/bin/env bash
set -Eeuo pipefail


function show_help {
    echo """
    ================================================================

    Build container.

    Usage:
        ./scripts/build.sh [options] <container>

    Options:
        -h | --help         show this message.

    <container>
        Expected values:
            - assets (default)
    ================================================================
    """
}

function build_container {
    echo """
    ================================================================
    ==  Building container  [${1}]
    ================================================================
    """

    docker compose build "${1}"

    echo """
    ================================================================
    ==  Built container  [${1}]
    ================================================================
    """
}

function _on_exit {
    # cleaning
    docker compose rm -f -v > /dev/null
    docker image prune -f   > /dev/null
    docker builder prune -f > /dev/null
}


# Generate credentials if missing
./scripts/secrets.sh --silent

trap '_on_exit' EXIT


app="assets"

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h | --help )
            show_help
            exit 0
        ;;

        assets )
            app="$1"
            shift
        ;;

        * )
            shift
        ;;
    esac
done


if [[ "${app}" = "assets" ]]; then
    docker compose kill assets
    docker compose rm -f -v assets
    docker volume rm gogrub_app_node_modules || true
    build_container assets
fi

