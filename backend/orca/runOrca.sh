#!/bin/bash

# run orca
/opt/orca_5_0_3_linux_x86-64_openmpi411/orca $1 > $2

# grab the relivent energies from the .log file
cat $2 | grep "Lowest Energy" | tail -n1 | cut -d' ' -f20
cat $2 | grep "Maximum Energy change" | tail -n1 | cut -d' ' -f13
