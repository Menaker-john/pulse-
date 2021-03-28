#Pulse Server Init

BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

packages="mongodb-org"

echo -e "${BLUE}Installing Nodejs...${NC}"
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
apt-get install -y nodejs

echo -e "${BLUE}Installing PM2...${NC}"
npm install pm2 -g

echo -e "${BLUE}Installing build-essentails...${NC}"
sudo apt-get install g++ build-essential

echo -e "${BLUE}Fetching Dependencies...${NC}"
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

echo -e "${BLUE}Installing Packages...${NC}"
sudo apt-get update
sudo apt-get install -y $packages

echo -e "${BLUE}Starting Mongodb Server...${NC}"
sudo systemctl start mongod
sudo systemctl status mongod
sudo systemctl enable mongod