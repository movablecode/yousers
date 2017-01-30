#!/bin/bash
moonc *.moon
pushd src
moonc -t ../dist .

