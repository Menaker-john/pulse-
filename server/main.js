import fs               from 'fs';
import { Meteor }       from 'meteor/meteor';
import { spawn  }       from 'child_process';
import {convertDate }   from '../imports/common.js';
import * as Collections from '../imports/api/collections.js';
import { 
  BasicDoc, parseBetween,
  sameDate, sameYearMonth,
} from './common.js';

function runDockerStats(){
  try{
  console.log('Running Docker Stats');
  let allData = '';
  let locked  = false;
  let delim   = String.fromCharCode(27, 91,50,74,27,91,72);
  let DockerStats = spawn("docker", ["stats", "--no-trunc"]);

  DockerStats.stdout.on("data", async data => {
    try{    
      if(!locked){
        allData += data;
        const parsed = parseBetween(delim, delim, allData);
        if(parsed){
          locked = true;
          const containers = {};
          const lines      = parsed.split('\n');
          lines.pop(); 
          lines.shift();
          lines.forEach((line, i) => {
            const arr = line.split(' ')
              .reduce((a,v) => {
                if(v){ a.push(v);
              } return a; }, []);

            if(!arr[1].includes('%')){
              containers[arr[1]] = {
                cid     :arr[ 0],
                name    :arr[ 1],
                cpu     :arr[ 2],
                mem     :arr[ 3],
                memLimit:arr[ 5],
                memCent :arr[ 6],
                netIn   :arr[ 7],
                netOut  :arr[ 9],
                hddIn   :arr[10],
                hddOut  :arr[12],
                pids    :arr[13],
              };
            }
          });

          let avgStats = Collections.analytics.findOne({_type: 'docker_stats_totals'});
          if(!avgStats){
            let def  = {
              instances: {}
            }
            avgStats =  BasicDoc.new(def, 'docker_stats_totals', 'analytics');
          }

          Object.keys(containers).forEach(name => {
            const cpu  = Number((containers[name].cpu     || "").replace('%', '')) || 0;
            const mem  = Number((containers[name].memCent || "").replace('%', '')) || 0;
            const date = new Date();
            const x    = date.toLocaleTimeString('en-US', {timeZone: 'America/Chicago' });
            const stat = {cpu, mem, date, x};

            if(avgStats.instances[name]){
              let instance = avgStats.instances[name];
              let minAvg   = instance.minAvg;
              let lastMin  = instance.lastMin;
              
              minAvg.push(stat);
              lastMin.push(stat);
              
              if((stat.date - lastMin[0].date) >= 60000){
                lastMin.shift();
              }

              if((stat.date - minAvg[0].date) >= 60000){
                const hourAvg  = instance.hourAvg;
                const lastHour = instance.lastHour;
                const stats    = minAvg.splice(0, minAvg.length - 1);

                let min = {cpu: 0, mem: 0, date: stats[0].date, x: stats[0].x};
                stats.forEach(stat => {
                  min.cpu += stat.cpu;
                  min.mem += stat.mem;
                });

                if((stats || []).length){
                  min.cpu /= stats.length;
                  min.mem /= stats.length;
                  min.cpu  = Number(min.cpu.toFixed(2));
                  min.mem  = Number(min.mem.toFixed(2));
                }
                hourAvg.push(min);
                lastHour.push(min);

                if((min.date - lastHour[0].date) >= 3600000){
                  lastHour.shift();
                }

                if((min.date - hourAvg[0].date) >= 3600000 ){
                  const mins     = hourAvg.splice(0, hourAvg.length - 1);
                  const lastDay  = instance.lastDay;
                  const todayAvg = instance.todayAvg;

                  let hour = {cpu: 0, mem: 0, date: hourAvg[0].date, x: hourAvg[0].x};
                  mins.forEach(stat => {
                    hour.cpu += stat.cpu;
                    hour.mem += stat.mem;
                  });

                  if((mins || []).length){
                    hour.cpu /= mins.length;
                    hour.mem /= mins.length;
                    hour.cpu  = Number(hour.cpu.toFixed(2));
                    hour.mem  = Number(hour.mem.toFixed(2));
                  }

                  lastDay.push(hour);
                  todayAvg.push(hour);
                  if((hour.date - lastDay[0].date) >= 86000000){
                    lastDay.shift();
                  }

                  if(!sameDate(hour.date, todayAvg[0].date)){
                    const lastYear  = instance.lastYear;
                    const lastMonth = instance.lastMonth;
                    const hours     = todayAvg.splice(0, todayAvg.length - 1);
                    const date      = hours[0].date; 
                    const x         = date.toLocaleDateString('en-US', {timeZone: 'America/Chicago'});
                    let today = {cpu: 0, mem: 0, date, x};

                    hours.forEach(stat => {
                      today.cpu += stat.cpu;
                      today.mem += stat.mem;
                    });
  
                    if((hours || []).length){
                      today.cpu /= hours.length;
                      today.mem /= hours.length;
                      today.cpu  = Number(today.cpu.toFixed(2));
                      today.mem  = Number(today.mem.toFixed(2));
                    }

                    lastMonth.push(today);
                    if(lastMonth.length > 30){
                      lastMonth.shift();
                    }

                    let month = lastYear.find(month => sameYearMonth(month.date, today.date));
                    if(month){
                      month.cpu     = Number((Number(((month.cpu || 0) * (month.counter || 0)) + today.cpu) / ((month.counter || 0) + 1)).toFixed(2));
                      month.mem     = Number((Number(((month.mem || 0) * (month.counter || 0)) + today.mem) / ((month.counter || 0) + 1)).toFixed(2));
                      month.counter = (month.counter || 0)+1;
                    }else{
                      const date = new Date(); 
                      lastYear.push({date, x: `${date.getFullYear()}-${date.getMonth() + 1}`, /* days: [today], */ counter: 0, cpu: 0, mem: 0});
                    }

                    if(lastYear.length > 12){
                      lastYear.shift();
                    }
                  }
                }
              }
            }else{
              avgStats.instances[name] = {
                lastMin   : [stat],
                lastHour  : [],
                lastDay   : [],
                lastMonth : [],
                lastYear  : [],
                minAvg    : [stat],
                hourAvg   : [],
                todayAvg  : [],
              } 
            }
          });
          try{
            Collections.analytics.update({_id: avgStats._id}, avgStats, {upsert: true});
          }catch(e){ console.log('Stats Update:', e); }
          

          let ds = Collections.analytics.findOne({_type: 'docker_stats'}) 
            || BasicDoc.new({}, 'docker_stats', 'analytics');
          ds.containers = containers;
          Collections.analytics.update({_id: ds._id}, ds, {upsert: true});

          allData = '';
          locked  = false;
        }
      }
    }catch(error){
      console.log('Failed on Parsing Docker Stats', error);
      setTimeout(runDockerStats, 1000);
    }
  });
  DockerStats.stderr.on("data", async data => {
    console.log(`stderr: ${data}`);
  });
  DockerStats.on('error', async (error) => {
    console.log(`error: ${error.message}`);
    setTimeout(runDockerStats, 1000);
  });
  DockerStats.on("close", async code => {
    console.log('Docker Stats Closed... Restarting Docker Stats');
    setTimeout(runDockerStats, 1000);
  });
  DockerStats.on("exit", async code => {
    console.log('Docker Stats Exit... Restarting Docker Stats');
    setTimeout(runDockerStats, 1000);
  });
}catch(e){
  setTimeout(runDockerStats, 1000);
  console.log('Error Running Docker Stats:', e);
}
}

async function runDockerLogs(){
  let names = [];
  let stats;
  try{
    stats = await Collections.analytics.findOne({_type: 'docker_stats'});
    if(stats && stats.containers){
      names = Object.keys(stats.containers).map( key => {
        if(stats.containers[key].cid){
          return stats.containers[key].name;
        }
      });
      const blacklistContainers = ['mongodb', 'mup-nginx-proxy', 'mup-nginx-proxy-letsencrypt']
      names = names.filter(name => !blacklistContainers.includes(name));
    }
  }catch(e){
    console.log('Error Finding Docker Stats:', e.toString());
  }
  try{
    let promises = names.map(async (name, i) => {
      return new Promise(async (resolve, reject) => {

        let cid = 0;
        if(stats && stats.containers){
          cid = stats.containers[name].cid;
        }
        const filepath = `/var/lib/docker/containers/${cid}/${cid}-json.log`;
        let fsStats;

        try{
          fsStats  = fs.statSync(filepath);
        }catch(e){
          console.log(name, ": Log file not found at:", cid);
          resolve();
          return;
        }

        const maxSize  = 51;

        if(fsStats['size'] > maxSize * 1000000){
          let date = new Date();
          date = convertDate(date);
          let log = await Collections.analytics.findOne({_type: 'docker_logs', current:true, name, date});
          if(!log){
            log = BasicDoc.new({
              name,
              count         : 1 ,
              lines         : "",
              current       : true,
              charCount     : 0,
              lastUpdatedAt : "",
            }, 'docker_logs', 'analytics');
          }

          log.tooLarge = true;
          log.maxSize  = maxSize;
          Collections.analytics.update({ _id: log._id }, { $set: log }, { upsert: true}, (err, res) => {
            if(err){
              console.log('Error Updating Docker Logs:', err);
              reject();
            }else{
              resolve();
            }
          });
        }else{
          let allData = ''
          let DockerLogs = spawn(`docker`, ['logs', '-t', name]);
          DockerLogs.stdout.on('data', function (data) {

            data = data.toString();
            allData += data;
          });
          DockerLogs.stderr.on('data', function (data) {
            data = data.toString();
            allData += data;
          });

          DockerLogs.on('close', function (code) {
            let out   = [];
            let dates = {};

            allData.split('\n').forEach(line => {
              out.push(line);  
            });

            out.sort((a, b) => a.substr(0,30) - b.substr(0,30));
            out.forEach(line => {
              let date = line.substr(0, 10);
              if(dates[date]){
                dates[date].push(line);
              }else{
                dates[date] = [line];
              }
            });
            
            let subPromises = Object.keys(dates).map(async date => {
              return new Promise(async (resolve, reject) => {
                if(date.length === 10){
                  let log = await Collections.analytics.findOne(
                    {_type: 'docker_logs', current:true, name, date}
                  );
                  if(!log){
                    log = BasicDoc.new({
                      name,
                      date,
                      count         : 1 ,
                      lines         : "",
                      current       : true,
                      charCount     : 0,
                      lastUpdatedAt : "",
                    }, 'docker_logs', 'analytics');
                  }
                  log.tooLarge = false;
                  const logs   = [];
                  let updated  = false;
                  const limit  = 100000;
                  for(const line of dates[date]){
                    let lineDate = line.substr(0, 30);
                    if(lineDate > log.lastUpdatedAt){
                      updated = true;
                      if(log.charCount + line.length > limit){
                        log.current = false;
                        logs.push(log);
                        log = BasicDoc.new({
                          name,
                          date,
                          lines         : line,
                          current       : true,
                          lastUpdatedAt : lineDate,
                          charCount     : line.length,
                          count         : log.count + 1,
                        }, 'docker_logs', 'analytics');
                      }else{
                        log.lines        += line + '\n';
                        log.charCount     = log.lines.length;
                        log.lastUpdatedAt = lineDate;
                      }
                    }
                  };
                  if(updated){ logs.push(log); }
                  let updatePromises = logs.map((log, i) => {
                    return new Promise((resolve, reject) => {
                      Collections.analytics.update({ _id: log._id }, { $set: log }, { upsert: true}, (err, res) => {
                        if(err){
                          console.log('Error Updating Docker Logs:', err);
                          reject();
                        }else{
                          resolve();
                        }
                      });
                    });
                  });

                  Promise.all(updatePromises).then(() => resolve(), () => reject());
                }else{
                  resolve();
                }
              });
            });

            Promise.all(subPromises).then(() => { resolve(); });
          });
        }
      });
    });
  
    Promise.all(promises).then(async () => {
      setTimeout(runDockerLogs, 3000);
    });
    
  }catch(e){
    console.log('Caught Error in runDockerLogs:', e);    
  }
}

Meteor.startup(() => {
  console.log('Pulse is Staring up...');
  
  if(Meteor.settings.public.isDev){

  }else{
    runDockerLogs();
  }
  if(!Meteor.users.findOne({ 'profile.type': 'admin' })){
    try{
      Accounts.createUser({
        username: 'admin',
        password: 'admin',
        profile: { type: 'admin'}
      });
      console.log("Admin Created");
    }catch(e){ console.log('Failed to Create Admin User'); }
  }
  runDockerStats();

});