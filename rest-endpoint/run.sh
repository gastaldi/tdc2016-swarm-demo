#!/bin/sh

mvn -Dswarm.port.offset=1000 clean wildfly-swarm:run
