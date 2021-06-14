#!/usr/bin/env bash
DIR=protos
# Make the generated directory if it doesn't exist
mkdir -p $DIR/generated
# Compile the .proto file for the helloworld package
protoc -I=$DIR helloworld.proto \
--js_out=import_style=typescript:$DIR/generated \
--grpc-web_out=import_style=typescript,mode=grpcwebtext:$DIR/generated

# Make the protos directory in the web folder if it doesn't exist
mkdir -p web/protos
# Copy the files inside the generated folder and put them in the web folder
cp -R ./protos/generated/ ./web/protos/.