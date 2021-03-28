import {Meteor}         from 'meteor/meteor';
import {buildFields}    from '../common.js';
import * as Collections from '../../imports/api/collections.js';

Meteor.methods({
  'logs.list'(){
    try{
      return Collections.analytics.find({_type: 'docker_logs'},
      {fields: buildFields(['name', 'count', 'date', 'current'])}).fetch();
    }catch(err){ console.log(err); }
  },

  'logs.fetch'(_id){
    try{
      return Collections.analytics.findOne({_type: 'docker_logs', _id});
    }catch(e){ console.log('Failed Fetching Logs:', e.toString()); }
  },
});