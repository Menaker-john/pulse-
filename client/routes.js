import React         from 'react';
import { mount }     from 'react-mounter';
import {MainLayout}  from '/imports/ui/MainLayout.jsx';
/* import DockerStats   from './components/docker.stats.jsx';

import ContainerLogs from './components/loggy.jsx'; */
import {MissingPage}  from '/imports/ui/MissingPage.jsx';
import AnalyticsContainer    from '/imports/ui/AnalyticsContainer.jsx';
import DockerStatsContainer    from '/imports/ui/DockerStatsContainer.jsx';
import LogsContainer    from '/imports/ui/LogsContainer.jsx';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('*', {
  action(){
    mount(MainLayout, {
      content: <MissingPage />,
      title: '404'
    });
  }
});
FlowRouter.route('/graphs', {
  name: 'Graphs',
  action(){
    mount(MainLayout, {
      content:<AnalyticsContainer />,
      title: 'Graphs'
    });
  }
});

FlowRouter.route('/login', {
  name: 'Login',
  action(){
    Meteor.logout();
    mount(MainLayout, {
      content: <div />,
    });
  }
});

FlowRouter.route('/', {
  name: 'Home',
  action(){
    FlowRouter.go('/graphs');
  }
});

FlowRouter.route('/stats', {
  name: 'Docker Stats',
  action(){
    mount(MainLayout, {
      content: <DockerStatsContainer />,
      title: 'Docker Stats',
    });
  }
});

FlowRouter.route('/logs', {
  name: 'Logs',
  action(){
    mount(MainLayout, {
      content:<LogsContainer />,
      title: 'Logs'
    });
  }
});

/* export default function(){
  console.log('HERE??');
  //const MainLayoutCtx = injectDeps(MainLayout);

   FlowRouter.notFound = {
    action: function() {
      console.log('HERE')
      mount(MainLayoutCtx, {
        content: <MissingPage />
      });
    }
  }; 



  FlowRouter.route('/login', {
    name: 'Login',
    action(){
      Meteor.logout();
      mount(MainLayoutCtx, {
        content: () => (<div></div>),
      });
    }
  });

  FlowRouter.route('/analytics/docker/stats', {
    name: 'Docker Stats',
    action(){
      mount(MainLayoutCtx, {
        content: () => (<DockerStats />),
        title: 'Docker Stats',
      });
    }
  });

  FlowRouter.route('/container/logs', {
    name: 'Container Logs',
    action(){
      mount(MainLayoutCtx, {
        content: () => (<ContainerLogs />),
        title: 'Container Logs'
      });
    }
  });

  FlowRouter.route('/analytics/graphs', {
    name: 'Graphs',
    action(){
      mount(MainLayoutCtx, {
        content: () => (<Analytics />),
        title: 'Graphs'
      });
    }
  });

} */