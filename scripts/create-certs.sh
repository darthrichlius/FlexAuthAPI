#!/bin/bash

# Accept directory as argument or default to './nginx/certs'
CERT_DIR=${1:-"./nginx/certs"}
CERT_KEY="$CERT_DIR/key.pem"
CERT_CERT="$CERT_DIR/cert.pem"


# Create certificate directory if missing
if [ ! -d "$CERT_DIR" ]; then
  mkdir -p "$CERT_DIR"
  echo "Created directory $CERT_DIR"
fi

# Ensure the directory has the correct ownership
echo "Ensuring correct ownership of $CERT_DIR for $(whoami)"
chown -R $(whoami):$(whoami) $CERT_DIR  # Change ownership to the current user

# Check if certificates exist
if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CERT" ]; then
  echo "Certificates not found. Generating new certificates..."
  openssl req -x509 -newkey rsa:4096 -keyout "$CERT_KEY" -out "$CERT_CERT" -days 365 -nodes \
  -subj "/CN=rdieud.app.local" \
  -addext "subjectAltName=DNS:rdieud.app.local,DNS:auth.rdieud.app.local,DNS:abstract.auth.rdieud.app.local"
  echo "Certificates created at $CERT_DIR"
else
  echo "Certificates already exist. Skipping generation."
fi
