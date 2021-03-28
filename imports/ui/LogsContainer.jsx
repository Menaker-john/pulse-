import { Meteor }      from 'meteor/meteor';
import Logs            from './Logs.jsx';
import { analytics }   from '../api/collections.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Session      } from 'meteor/session';
import { convertDate } from '/imports/common.js';

export default AnalyticsContainer = withTracker(() => {

  const defaultDate = convertDate(new Date());

  const name      = Session.get('log.name'     ) || '';
  const date      = Session.get('log.date'     ) || defaultDate;
  const count     = Session.get('log.count'    ) || 0;
  const isCurrent = Session.get('log.isCurrent') === undefined ?
    true : Session.get('log.isCurrent');

  const dockerLogsHandle = Meteor.subscribe('docker.logs',
    {name, date, isCurrent, count}
  );
  const loading = !dockerLogsHandle.ready();
  const current = analytics.findOne({
    _type: 'docker_logs', name, date, $or: [{current: isCurrent}, {count}]
  });

  if(current){
    if(isCurrent){
      current.title = 'Current';
    }else{
      current.title = current.date + ` # ${current.count}`;
    }
  }

  const exists = !loading && !!current;
  return {
    loading,
    current,
    exists,
  };
})(Logs);

