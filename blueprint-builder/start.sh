#!/bin/bash
# Start backend in background
cd /workspace/blueprint-builder/backend
node src/index.js &
BACKEND_PID=$!

# Start frontend (exposed port)
cd /workspace/blueprint-builder/frontend
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

wait
