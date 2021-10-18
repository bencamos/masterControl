#!/bin/bash
openssl rsa -in <(echo "$1") -pubout 2>/dev/null
