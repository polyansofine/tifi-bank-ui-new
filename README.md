# install node modules

npm install

Try adding `--force` if there are error.

# start tifi-bank project

npm run start

# Deploy on Apache
npm run build
mv build bank
scp -r bank root@vm:/var/www/html/
rm -rf bank

# Setup Apache
In httpd.conf, add the following lines:

'''
<Directory "/var/www/html/bank">
    Options FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
'''

In the folder /var/www/html/bank, create a .htaccess file with following contents:

'''
RewriteEngine On
RewriteBase /bank
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /bank/index.html [L]
'''