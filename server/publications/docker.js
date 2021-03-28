import { Meteor    } from 'meteor/meteor'    ;
import { analytics } from '../../imports/api/collections.js';


Meteor.publish('docker.stats.current', function () {
  return analytics.find({_type: 'docker_stats'});
});

Meteor.publish('docker.logs', function (data) {
  const {name, date, count, isCurrent} = data;
  const query = {_type: 'docker_logs', name, date};

  if(isCurrent){ query.current = true}
  else { query.count = count; }

  return analytics.find(query);
});

Meteor.publish('docker.stats.totals', function () {
  return analytics.find({_type: 'docker_stats_totals'});
});