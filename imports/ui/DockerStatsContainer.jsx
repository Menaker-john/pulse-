import { Meteor }      from 'meteor/meteor';
import DockerStats     from './DockerStats.jsx';
import { analytics }   from '../api/collections.js';
import { withTracker } from 'meteor/react-meteor-data';

export default DockerStatsContainer = withTracker(() => {
  const dockerStatsHandle = Meteor.subscribe('docker.stats.current');
  const loading           = !dockerStatsHandle.ready();
  const stats             = analytics.findOne({_type: 'docker_stats'});
  const exists            = !loading && !!stats;

  return {
    loading,
    stats,
    exists,
  };
})(DockerStats);

