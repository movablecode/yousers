#!/bin/bash
moonc *.moon
pushd src
moonc -t ../dist *.moon lib test

