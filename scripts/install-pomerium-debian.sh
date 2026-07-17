#!/usr/bin/env bash

set -euo pipefail

if [[ "$(uname -s)" != 'Linux' ]] || [[ ! -f /etc/debian_version ]]; then
  echo 'This installer supports Debian and Ubuntu only.' >&2
  exit 1
fi

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
elif command -v sudo >/dev/null 2>&1; then
  SUDO=(sudo)
else
  echo 'Run this script as root or install sudo.' >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  debian-archive-keyring \
  debian-keyring \
  gnupg

source /etc/os-release
distro="${ID}"
codename="${VERSION_CODENAME:-}"

if [[ "${distro}" != 'debian' && "${distro}" != 'ubuntu' ]]; then
  echo "Unsupported Debian-based distribution: ${distro}" >&2
  exit 1
fi

if [[ -z "${codename}" ]]; then
  echo 'Unable to determine the distribution codename.' >&2
  exit 1
fi

keyring_location='/usr/share/keyrings/pomerium-pomerium-archive-keyring.gpg'
repository_location='/etc/apt/sources.list.d/pomerium-pomerium.list'
temporary_keyring="$(mktemp)"
temporary_repository="$(mktemp)"
trap 'rm -f "${temporary_keyring}" "${temporary_repository}"' EXIT

curl --fail --silent --show-error --location \
  'https://dl.cloudsmith.io/public/pomerium/pomerium/gpg.6E388440B94E1407.key' \
  | gpg --dearmor --output "${temporary_keyring}"

curl --fail --silent --show-error --location \
  "https://dl.cloudsmith.io/public/pomerium/pomerium/config.deb.txt?distro=${distro}&codename=${codename}&component=main" \
  --output "${temporary_repository}"

"${SUDO[@]}" install -m 644 "${temporary_keyring}" "${keyring_location}"
"${SUDO[@]}" install -m 644 "${temporary_repository}" "${repository_location}"
"${SUDO[@]}" apt-get update
"${SUDO[@]}" apt-get install -y pomerium

echo 'Pomerium installed successfully.'
echo 'Configure /etc/pomerium/config.yaml before enabling the service.'
echo 'Then run: sudo systemctl enable --now pomerium.service'
