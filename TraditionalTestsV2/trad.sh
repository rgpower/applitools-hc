#!/bin/bash

ver=2

[ -f Traditional-V${ver}-TestResults.txt ] && rm Traditional-V${ver}-TestResults.txt

for browser in chrome firefox chromium edge
do
  for tasknum in 1 2 3
  do
    npx cypress run --browser $browser --headless --spec cypress/integration/applifashion/task${tasknum}.spec.js --env TEST_VERSION=${ver} 1>/dev/tty 2>>Traditional-V${ver}-TestResults.txt
  done
done
