# Setup Vagrant virtual box to run Node.js server

Tested on 18/05/2019

## Pre-requirement

- [Vagrant](https://www.vagrantup.com/downloads.html)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- npm
- express-generator `npm install express-generator -g`

## Create a Node.js skeleton

[Hogan.js](http://twitter.github.io/hogan.js/) is the mustache syntax from twitter, very straight forward.

```bash
express --hogan my-node-app
```

## Starting virtual machine

- Create `vagrant` folder
- Add `.vagrant/` to `.gitignore`

From the empty `vagrant` folder

```bash
# install Vagrant box
# https://app.vagrantup.com/boxes/
vagrant box add ubuntu/xenial64
vagrant up
vagrant status
vagrant ssh
```

### Config `Vagrantfile` file

- `Vagrantfile` is written in Ruby.
- In `Vagrantfile`, uncomment `config.vm.network "private_network", ip: "192.168.33.10"`, you can have any IP you want, let's say `55.55.55.55`
- Add shared folder, `config.vm.provision "file", source: "./shared", destination: "$HOME/shared"`

```bash
vagrant reload
```

- Use `vagrant reload --provision` to copy file from local shared folder to VM

## Running nginx on virtual machine

From VM:

```
sudo apt-get update
sudo apt-get install nginx
sudo service nginx start
```

Run `sudo service nginx stop` to stop the service

`lsb_release -a`: check Linux version

## Adding domain name to local DNS lookup

### Windows

```
C:\Windows\System32\Drivers\etc\hosts
```

### Mac

```
sudo vim /etc/hosts
```

In `hosts` file, add line `55.55.55.55 dev.mynodeapp.com` to the bottom

## Install Node on VM

(Tutorial)[https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04]

From VM:

```bash
cd ~
# Current LTS version: 10.x
curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
nodejs -v
```

## Install `yarn`

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

## ~~Add a deploy user (For real machine only, should skip for Vagrant)~~

From VM:

```bash
sudo useradd --create-home -s /bin/bash deploy
sudo adduser deploy sudo
sudo passwd deploy
```

username: deploy

password: deploy-password

From VM:

```bash
mkdir .ssh
```

Copy ssh key to remote server

```bash
scp ~/.ssh/id_rsa.pub deploy@url.com:~/.ssh/authorized_keys
```

## Copy and build Node app

### Instal yarn

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

### Copy file

- Copy files from local machine to `./vagrant/shared/my-node-app` folder. (Which we previously added provision to).
- Excluding the `node_modules` and `vagrant` folders.
- Run `vagrant reload --provision` to copy the files

From VM

```bash
mv ~/shared/my-node-app ~
cd ~/my-node-app
yarn
yarn start
```

Open another SSL connection

```
curl http://localhost:3000
```

If you see the html page, the app is working properly on Vagrant VM now.

## Run node server as a Linux system service

### Install PM2

**PM2**: a process manager

```bash
sudo npm install -g pm2

# start application
pm2 start ./bin/www

# Save processes for Restart on Boot **IMPORTANT!!!**
pm2 save

# generate startup script
pm2 startup systemd

# remove
pm2 unstartup systemd

# check systemctl
systemctl status pm2-vagrant
```

PM2 commands

```bash
pm2 stop <app_name_or_id>
pm2 restart <app_name_or_id>
pm2 info <app_name_or_id>

# show process monitor
pm2 monit
```

### Set Up Nginx as a Reverse Proxy Server

```bash
cd /etc/nginx/sites-available
sudo vim default
```

#### Vim tips

- `i`: switching to **insert** mode
- ESC: switching to command mode
- `:q`: quit (`:q!`: quit without save; `:wq`: write and quit)
- `:w`: write

Add proxy configuration into `server` block in `default` file

```
server {
  ...
  location / {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

To map another url, e.g. `http://http://dev.mynodeapp.com/app2`

```
server {
  ...
  location / {
    ...
  }

  location /app2 {
    proxy_pass http://localhost:8081;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Testing current configuration

```bash
sudo nginx -t
```
