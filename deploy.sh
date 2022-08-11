#!/bin/bash
npm run build
mv build bank
scp -r bank root@vm:/var/www/html/
rm -rf bank
