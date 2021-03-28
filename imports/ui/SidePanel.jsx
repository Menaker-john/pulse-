import React      from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
export default class SidePanel extends React.Component{
  render(){
    const path = FlowRouter.current().path;
    const items = [
      {name: 'Graphs'           , path: '/graphs' },
      {name: 'Docker Statistics', path: '/stats'  },
      {name: 'Container Logs'   , path: '/logs'   },
      {name: 'divider'          , path: ''        },
      {name: 'Logout'           , path: '/login'  },
    ];

    return(
      <div className='wrapper' >
        <nav id='sidebar' >
          <div className="sidebar-header">
            <h3><img style={{maxWidth: '52px', maxHeight: '52px'}} src='/images/heartbeat1.png'/><b><i style={{verticalAlign:'middle'}}>Pulse</i></b></h3>
          </div>
          <ul className="list-unstyled components">
            {items.map((item, k) => {
              if(item.items){
                return(
                  <li key={`${item.name}${k}`}>
                    <a href={item.path} data-toggle="collapse" aria-expanded="false">{item.name}</a>
                    <ul className="collapse list-unstyled" id={item.path.substring(1,item.path.length)}>
                      {item.items.map((subItem, i) => {
                        if(subItem.name !== 'divider'){
                          let className = '';
                          if(subItem.path === path){ className += 'active'; }
                          return <li key={`${k}${i}${subItem.name}`}><a className={className} href={subItem.path}>{subItem.name}</a></li>
                        }else{
                          return <li key={`${k}${i}${subItem.name}`} className='divider'></li>
                        }
                      })}
                    </ul>
                  </li>
                );
              }else{
                if(item.name !== 'divider'){
                  let className = '';
                  if(item.path === path){ className += 'active'; }
                  return <li key={`${k}${item.name}`}><a className={className} href={item.path}>{item.name}</a></li>;
                }else{
                  return <li key={`${k}${item.name}`} className='divider'></li>;
                }
              }
            })}
          </ul>
        </nav>
      </div>
    );
  }
};