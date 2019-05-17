# Setup Vagrant virtual box to run Node.js server

Tested on 18/05/2019

## Starting virtual machine

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
