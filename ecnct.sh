#!/bin/sh
NODE_HOME=/QOpenSys/pkgs/bin
ECNCT_HOME=/home/demo/eradani-connect-server

NODE_ENV=production
export NODE_ENV

PATH=$NODE_HOME:$PATH

cd $ECNCT_HOME
npm start

