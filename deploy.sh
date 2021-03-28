#pulse Deployment
res1=$(date +%s.%N)

user="$1"
pass="$2"
server="$3"
enviornment="$4"
opr="$5"

if [ "$5" = "deploy" ]; then
  echo Building Pulse...
  TOOL_NODE_FLAGS=--max_old_space_size=4096 meteor build ../builds/pulse
  sshpass -p $pass ssh $user@$server "sudo mkdir -p /opt/meteor-apps/pulse"
  echo Copying Bundle...
  sshpass -p $pass rsync -av --progress ../builds/pulse/pulse.tar.gz $user@$server:/opt/meteor-apps/pulse/pulse.tar.gz
  echo Unpacking Bundle...
  sshpass -p $pass ssh $user@$server "cd /opt/meteor-apps/pulse;tar -zxf pulse.tar.gz;cd bundle/programs/server;npm install;cd assets/app;mv ecosystem.config.js /opt/meteor-apps/pulse/bundle;"
  echo Starting Pulse...
  sshpass -p $pass ssh $user@$server "cd /opt/meteor-apps/pulse/bundle; pm2 start ecosystem.config.js --env $enviornment; pm2 save;" 
elif [ "$5" = "stop" ]; then
  echo Stopping Pulse...
  sshpass -p $pass ssh $user@$server "pm2 stop pulse"
elif [ "$5" = "start" ]; then
  echo Starting Pulse...
  sshpass -p $pass ssh $user@$server "pm2 start pulse"
else
  echo Invalide Operation Command
fi


res2=$(date +%s.%N)
dt=$(echo "$res2 - $res1" | bc)
dd=$(echo "$dt/86400" | bc)
dt2=$(echo "$dt-86400*$dd" | bc)
dh=$(echo "$dt2/3600" | bc)
dt3=$(echo "$dt2-3600*$dh" | bc)
dm=$(echo "$dt3/60" | bc)
ds=$(echo "$dt3-60*$dm" | bc)

printf "Pulse Deployment to $server Complete: %d:%02d:%02d:%02.4f\n" $dd $dh $dm $ds
