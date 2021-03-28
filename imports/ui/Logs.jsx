import React                      from 'react';
import { Session      }           from 'meteor/session';
import { wordsInString, Methods } from '/client/common.js';
import {
  Fieldset, FormDropdownList, TextArea, TextValue,
} from '/imports/ui/components.jsx';

function dateSort(a, b){
  return (
    b.date  > a.date  ?  1 :
    b.date  < a.date  ? -1 : 0 
  );
}
function countSort(a, b){
  return (
    b.count > a.count  ?  1 :
    b.count < a.count  ? -1 : 0 
  );
}
function sort(a, b){
  return dateSort(a,b) || countSort(a,b);
}

function updateSession(values){
  Session.set('log.name'     , values.name      );
  Session.set('log.count'    , values.count     );
  Session.set('log.date'     , values.date      );
  Session.set('log.isCurrent', values.isCurrent );
  Session.set('log.value'    , values.value     );
}

export default class Logs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      filter   : '',
      filtered : {},
    }
  }

  componentDidMount(){
    let filtered = {};
    Methods.Meteor('logs.list').then((logs) => {
      logs.forEach(log => {
        log.title = log.date + ` # ${log.count}`;
        if(!log.date.includes('Error')){
          if((filtered[log.name] || []).length){
            filtered[log.name].push(log)
          }else{
            filtered[log.name] = [log];
          }
        }
      });
      Object.keys(filtered).forEach(key => {
        filtered[key].unshift({title: 'Current', name: key});
      });
      this.setState({filtered});
    }).catch(err => { console.log(err); });

    this.onChangeContainer('');
    if(this.refs.textAreaRef){
      this.refs.textAreaRef.scrollToBottom(true);
    }
  }

  componentDidUpdate(){
    if(this.refs.textAreaRef){
        this.refs.textAreaRef.scrollToBottom();
    }
  }

  onChangeContainer(name){
    let container = this.state.filtered[name] || [];
    container.sort(sort);
    let log = container[0];
    if(log){
      updateSession({
        name,
        value    : log,
        isCurrent: true,
        date     : container[1].date,
        count    : container[1].count,
      });
    }
  }

  onChangeLogFile(value){
    const name       = value.name;
    let date         = value.date;
    let isCurrent    = false;

    if(value.title === 'Current'){
      isCurrent = true;
      let container = this.state.filtered[name] || [];
      if (container.length > 1) {
        container.sort(sort);
      }
      date = container[1].date;
    }
    
    updateSession({
      name,
      value,
      isCurrent,
      date     : date,
      count    : value.count,
    });
  }

  onChangeFilter(value){ this.setState({filter: value}); }

  filterLines(){
    const { current } = this.props;
    const { filter  } = this.state;
    const lines       = ((current || {}).lines || '').split('\n');
    const filtered    = lines.filter(line => wordsInString(filter, line)) || [];
    return filtered.join('\n');
  }

  render(){
    const { filtered } = this.state;
    let items = [];

    const name  = Session.get('log.name' );
    const value = Session.get('log.value'); 
    items = (filtered[name] || []).sort(sort);

    const lines = this.filterLines();
    
    return(
      <Fieldset name='Logs' style={{marginRight : '15px'}} >

        <FormDropdownList name="Container"
          style={{marginRight : '15px', width:'100%'}}
          filter='contains'
          value={name ? name : undefined}
          valueComponent={({item})=>(<span>{item}</span>)}
          itemComponent ={({item})=>(<span>{item}</span>)}
          items={Object.keys(filtered)}
          onChange={this.onChangeContainer.bind(this)} />

        <FormDropdownList name='Log File'
          style={{marginRight : '15px', width:'100%'}}
          filter='contains'
          textField='title'
          valueField='title'
          value={value}
          valueComponent={({item})=>(<span>{(item || {}).title || ""}</span>)}
          itemComponent ={({item})=>(<span>{(item || {}).title || ""}</span>)}
          items={items}
          onChange={this.onChangeLogFile.bind(this)} />

        <TextValue
          style={{marginRight : '15px', width:'100%'}}
          name='Filter'
          onChange={this.onChangeFilter.bind(this)} />

        <TextArea style={{marginRight : '15px', fontFamily: 'monospace'}}
          ref='textAreaRef' rows={22} readOnly value={lines} />
      </Fieldset>
    );
  }
};