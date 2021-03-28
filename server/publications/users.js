Meteor.publish('users.current', function (_id) {
  return Meteor.users.find({ _id: _id });
});