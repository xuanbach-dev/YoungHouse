#!/bin/bash

# Print system and environment information
echo "System Information:"
uname -a
echo "\n"

echo "Node Version:"
node --version
echo "\n"

echo "NPM Version:"
npm --version
echo "\n"

echo "Environment Variables:"
env | grep REACT_APP
echo "\n"

echo "Installed Packages:"
npm list --depth=0
echo "\n"

echo "Build Process Debugging:"
npm run build --verbose
