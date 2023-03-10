#! /bin/bash

for f in *; do 
    mv "$f" "${f%.*}.private.${f##*.}";
done
