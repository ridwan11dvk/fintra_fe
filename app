#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

IMAGE_NAME="${IMAGE_NAME:-fintra_fe}"
OUTPUT_DIR=".output"

usage() {
  cat <<EOF
Usage: ./app <perintah> [argumen...]

Perintah:
  run     Jalankan dev server (npm run dev)
  lint    Jalankan ESLint, simpan laporan ke ${OUTPUT_DIR}/lint/eslint-report.json
  test    Jalankan unit test & e2e (npm run test)
  issues  Alias: sonarcli list issues -p <SONARQUBE_PROJECT dari .env>
  build   Jalankan npm run build (default)
          Opsi:
            (tanpa arg) / npm     Jalankan npm run build (lokal)
            docker               Build image dari Dockerfile (docker/podman)
            all                  npm run build lalu build Docker image

Contoh:
  ./app run
  ./app build --platform linux/amd64
  ./app build npm
  ./app build all
EOF
}

cmd_run() {
  npm run dev -- "$@"
}

cmd_lint() {
  mkdir -p "${OUTPUT_DIR}/lint"
  local status=0
  npm run lint -- "$@" || status=$?
  npx eslint . -f json -o "${OUTPUT_DIR}/lint/eslint-report.json" >/dev/null 2>&1 || true
  echo "Laporan lint disimpan ke ${OUTPUT_DIR}/lint/eslint-report.json"
  return "$status"
}

cmd_test() {
  npm run test -- "$@"
}

cmd_issues() {
  local project
  project="$(grep -E '^[[:space:]]*SONARQUBE_PROJECT[[:space:]]*=' .env 2>/dev/null | head -n1 | sed -E 's/^[^=]+=//; s/^[[:space:]]*//; s/[[:space:]]*$//; s/^"//; s/"$//; s/^'"'"'//; s/'"'"'$//')"
  if [ -z "$project" ]; then
    echo "Error: SONARQUBE_PROJECT tidak ditemukan di .env" >&2
    exit 1
  fi
  sonarcli list issues -p "$project" "$@"
}

_build_engine() {
  if command -v docker >/dev/null 2>&1; then
    echo "docker"
  elif command -v podman >/dev/null 2>&1; then
    echo "podman"
  else
    echo "Error: docker atau podman tidak ditemukan di sistem." >&2
    return 1
  fi
}

cmd_build() {
  local mode="${1:-npm}"
  case "$mode" in
    docker|--docker)
      shift || true
      local engine
      engine="$(_build_engine)" || exit 1
      echo "Build image '${IMAGE_NAME}' (Dockerfile saja) menggunakan ${engine}..."
      "$engine" build -t "${IMAGE_NAME}" "$@" .
      ;;
    all|--all)
      shift || true
      echo "Menjalankan npm run build..."
      npm run build
      local engine
      engine="$(_build_engine)" || exit 1
      echo "Build image '${IMAGE_NAME}' menggunakan ${engine}..."
      "$engine" build -t "${IMAGE_NAME}" "$@" .
      ;;
    *)
      # npm run build (default): mode may be 'npm'/'--npm'/'local' keyword or npm args
      if [ "$mode" = "npm" ] || [ "$mode" = "--npm" ] || [ "$mode" = "local" ] || [ "$mode" = "--local" ]; then
        shift || true
      fi
      echo "Menjalankan npm run build..."
      npm run build "$@"
      ;;
  esac
}

case "${1:-}" in
  run)   shift; cmd_run "$@" ;;
  lint)  shift; cmd_lint "$@" ;;
  test)   shift; cmd_test "$@" ;;
  issues) shift; cmd_issues "$@" ;;
  build)  shift; cmd_build "$@" ;;
  build:docker) shift; cmd_build docker "$@" ;;
  build:npm|npm-build|build:web) shift; cmd_build npm "$@" ;;
  build:all) shift; cmd_build all "$@" ;;
  -h|--help|help|'') usage ;;
  *)
    echo "Perintah tidak dikenal: $1" >&2
    usage
    exit 1
    ;;
esac
