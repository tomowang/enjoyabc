### Requirements

* ubuntu server 12.04
* nodejs 0.8+
* nginx
* MongoDB 2.0+

### Prepare

#### [nginx](http://wiki.nginx.org/Install)

    sudo -s
    nginx=stable # use nginx=development for latest development version
    add-apt-repository ppa:nginx/$nginx
    apt-get update 
    apt-get install nginx

#### [nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint-elementary-os)

    #apt-get install software-properties-common
    apt-get install python-software-properties python g++ make
    add-apt-repository ppa:chris-lea/node.js
    apt-get update
    apt-get install nodejs

#### [mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/)

    #import mongodb public GPG key
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
    apt-get update
    apt-get install mongodb-10gen
    service mongodb start

#### others

    apt-get install git
    apt-get install imagemagick
    apt-get install libav-tools
    npm install -g forever

### Installation
#### install package via git

    cd ~
    git clone https://tomowang@bitbucket.org/tomowang/enjoyabc.git
    #git clone git@bitbucket.org:tomowang/enjoyabc.git
    cd enjoyabc
    npm install

#### start service

    forever start app.js
    forever list

#### configure and start nginx

add nginx configure file to `/etc/nginx/sites-available/` (file name `enjoyabc`)
 
    server {
        listen   80;
    
        server_name _;
        client_max_body_size 0;
    
        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;
    
            proxy_pass http://127.0.0.1:3000;
            proxy_redirect off;
        }
        location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|static/|fonts/|downloads/|robots.txt|humans.txt|favicon.ico) {
            access_log off;
            root /home/tomo/enjoyabc/public/;
            expires max;
        }
    }

link configure and start nginx:

    cd /etc/nginx/sites-enabled
    ln -s /etc/nginx/sites-available/enjoyabc ./
    service nginx start

#### initialize admin account

Go to `http://127.0.0.1/login`, click register to register an administrator account,
say "administrator" as user name.
The default role is `user`. change the role to `admin` in mongo:

    mongo
    >use enjoyabc;
    >db.users.find()
    >db.users.update({'username': 'administrator'}, {'$set': {'role': 'admin'}})

After the `role` changed, go to login page to log in.
Now the navigation menu should show.
