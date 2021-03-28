import { Mongo } from 'meteor/mongo';

export const nodes     = new Mongo.Collection('nodes');
export const network   = new Mongo.Collection('network');
export const analytics = new Mongo.Collection('analytics');
