#!/bin/bash

# ==================================================
# run orca

/opt/orca_5_0_3_linux_x86-64_openmpi411/orca $1 > $2

# ==================================================
# grab the relivent energies from the .log file

# Excited Energy
cat $2 | grep "Lowest Energy" | tail -n1 | cut -d' ' -f20
# Ground state
cat $2 | grep "E(SCF)" | cut -c 19-30
