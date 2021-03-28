import React                   from 'react';
import {Table, Td, Fieldset  } from '/imports/ui/components.jsx';
import { toBytes, namedBytes } from '/client/common.js';

export default class DockerStats extends React.Component{
  render(){
    const { stats, exists }  = this.props;
    if(!exists){
      return (<div>No Data</div>)
    }
    const containers = stats.containers; 

    let totals = {
      cid      : 'Totals',
      name     : 0,
      cpu      : 0,
      mem      : 0,
      memLimit : 0,
      memCent  : 0,
      netIn    : 0,
      netOut   : 0,
      hddIn    : 0,
      hddOut   : 0,
      pids     : 0,
     }

    Object.keys(containers).map(name => {
      Object.keys(containers[name]).map((key, i) => {
        if(key !== 'cid'){
          if(key === 'name'){
            totals[key]++; 
          }else{
            totals[key] += toBytes(containers[name][key])
          }
        }
      });
    });
    totals.memLimit /= totals.name; 

    let headers = [
      { name: 'CID'        , width:'200px'               },
      { name: 'Name'       ,                             },
      { name: 'CPU %'      , width:'150px', just:'right' },
      { name: 'Mem %'      , width:'150px', just:'right' },
      { name: 'Mem Usage'  , width:'150px', just:'right' },
      { name: 'Mem Limit'  , width:'150px', just:'right' },
      { name: 'Net In'     , width:'150px', just:'right' },
      { name: 'Net Out'    , width:'150px', just:'right' },
      { name: 'Disk Write' , width:'150px', just:'right' },
      { name: 'Disk Read'  , width:'150px', just:'right' },
      { name: 'PIDs'       , width:'100px', just:'right' },
    ];
    const style = {textAlign:"right"};

    return(
      <Fieldset name='Docker Stats'>
        <Table headers={headers} style={{fontFamily: 'monospace', fontSize: '12pt'}}>
          {Object.keys(containers).map((key, i) => {
            return(
              <tr key={i}>
                <Td              >{ containers[key].cid.slice(0, 12)              }</Td>
                <Td              >{ containers[key].name                          }</Td>
                <Td style={style}>{ containers[key].cpu                           }</Td>
                <Td style={style}>{ containers[key].memCent                       }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].mem     )) }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].memLimit)) }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].netIn   )) }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].netOut  )) }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].hddIn   )) }</Td>
                <Td style={style}>{ namedBytes(toBytes(containers[key].hddOut  )) }</Td>
                <Td style={style}>{ containers[key].pids                          }</Td>
              </tr>
            );
          })}
          <tr style={{fontWeight: 'bold'}}>
            <Td      >  Totals                        </Td>
            <Td      >{ totals.name                  }</Td>
            <Td style={style}>{ totals.cpu    .toFixed(2)+'%'}</Td>
            <Td style={style}>{ totals.memCent.toFixed(2)+'%'}</Td>
            <Td style={style}>{ namedBytes(totals.mem      ) }</Td>
            <Td style={style}>{ namedBytes(totals.memLimit ) }</Td>
            <Td style={style}>{ namedBytes(totals.netIn    ) }</Td>
            <Td style={style}>{ namedBytes(totals.netOut   ) }</Td>
            <Td style={style}>{ namedBytes(totals.hddIn    ) }</Td>
            <Td style={style}>{ namedBytes(totals.hddOut   ) }</Td>
            <Td style={style}>{ totals.pids                  }</Td>
          </tr>
        </Table>
      </Fieldset>
    );
  }
};




