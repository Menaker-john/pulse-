import { Meteor }      from 'meteor/meteor';
import Analytics       from './Analytics.jsx';
import { analytics }   from '../api/collections.js';
import { withTracker } from 'meteor/react-meteor-data';

export default AnalyticsContainer = withTracker(() => {
  const dockerStatsHandle = Meteor.subscribe('docker.stats.totals');
  const loading           = !dockerStatsHandle.ready();
  const totals            = analytics.findOne({_type: 'docker_stats_totals'});
  const exists            = !loading && !!totals;
  let defaultInstance     = ""
  let instances = [];
  if(totals){ instances = totals.instances; }
  
  const instanceKeys = Object.keys(instances);
  if(instanceKeys.length){ defaultInstance = instanceKeys[0]; }

  return {
    loading,
    totals,
    exists,
    defaultInstance
  };
})(Analytics);

