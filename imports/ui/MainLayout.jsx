/* import Login     from './login.jsx'; */
import SidePanel      from '/imports/ui/SidePanel.jsx';
import React          from 'react';
import { Grid, Col }  from '/imports/ui/components.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import Login          from './Login.jsx';

export const MainLayout = props => {
  const user = useTracker(() => Meteor.user());

  const {title, content} = props;
  if(!title){
    document.title = 'Pulse';
  }else{
    document.title = title;
  }
  
  return (
    <div>
      { user 
        ? <Grid>
          <Col>
            <div>
              <SidePanel />
            </div>
          </Col>
          <Col style={{ padding: '15px', paddingLeft: '275px' }}>
            {content}
          </Col>
        </Grid> 
        :<Login />
      }
    </div>
  );
} 


