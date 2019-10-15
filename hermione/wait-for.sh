#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until curl "$host" >/dev/null 2>/dev/null; do
  >&2 echo "$host is unavailable - waiting"
  sleep 2
done

>&2 echo "$host - alive"