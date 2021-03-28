
import React                        from 'react';
import Recharts                     from 'recharts';
import { Fieldset, Grid, Row, Col } from '/imports/ui/components.jsx';

const graphs = [
  {key: 'lastMin'  , name: "Last Minute"},
  {key: 'lastHour' , name: "Last Hour"  },
  {key: 'lastDay'  , name: "Last Day"   },
  {key: 'lastMonth', name: "Last Month" },
  {key: 'lastYear' , name: "Last Year"  },
];

export default class Analytics extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      instance    : "",
      graph       : "lastMin",
      dataKeys    : ['cpu', 'mem'],
      curDataKey  : "cpu",
      active      : false,
      showAll     : false,
    }
  }

  percentComponent(percent){
    const color = this.getPercentColor(percent);
    return <span style={{color}}>{percent}</span>;
  }

  render(){
    const { totals, defaultInstance, exists, loading } = this.props;
    const { instance, graph, curDataKey              } = this.state;
    const {
      XAxis, YAxis, Tooltip, Area,
      ReferenceLine, Legend, AreaChart,  
    } = Recharts;

    let selectedInstance = instance? instance : defaultInstance;

    if(loading){ return(<div>Loading...</div>); }

    if(!exists){ return(<div>No Data</div>); }

    let data    = [];
    let percent = 0;
    if(selectedInstance && graph){
      data = totals.instances[selectedInstance][graph];
      if(data.length){
        percent = data[data.length-1][curDataKey];
      }else{
        selectedInstance = "";
        percent = 0;
      }
    }

    const instanceName = (selectedInstance || "").toUpperCase();
    const graphName    = this.getGraphName(graph);
    const buttonProps  = {
      type      :'button',
      style     : {borderColor:'#fff', borderWidth:'1px'},
    };

    return(
      <div>
        <Grid style={{width: '100%'}} >
          <center>
            <Row>
              <b>{`${instanceName}`}</b>&nbsp;&nbsp;{`${graphName}`}
              &nbsp;({this.percentComponent(percent)}%)
            </Row>
            <Row>
              <Col style={{width:'1000px'}}>
                <AreaChart
                  width={1000}
                  height={400}
                  data={data}
                  margin={{ left: 0, right: 30, bottom: 20, }}>
                  <XAxis dataKey="x" />
                  <YAxis domain={[0, 200]} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={100} stroke="#D90429" />
                  <Area isAnimationActive={this.state.active} type="monotone"
                    dataKey={curDataKey} stroke="#2c3e50" fill='#2c3e50' dot={false} />
                </AreaChart>
              </Col>
              <Col style={{verticalAlign:'top'}}>
                <div className='btn-group-vertical'>
                  {graphs.map(e => {
                    return (
                      <button {...buttonProps} key={e.key}
                        className={this.generateButtonClassName(e.key)}
                        onClick={this.changeSelectedGraph.bind(this, e.key)}
                      >
                        {e.name}
                      </button>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </center>
        </Grid>
        <Fieldset name={<b>Instances</b>}>
          <Grid>
            {this.getGraphTable().map((row, i) => [
              <Row key={`${i}-Headers`}> {row[1]} </Row>,
              <Row key={`${i}-Body`}>    {row[0]} </Row>
            ])}
          </Grid>
        </Fieldset>
      </div>
    );
  }

  getGraphName(key){
    const graph = graphs.find(e => e.key === key);
    if(graph && graph.name){
      return graph.name;
    }
    return 'Unknown';
  }

  getGraphTable(){
    const { totals  } = this.props;
    const { graph   } = this.state;
    const { 
      XAxis, YAxis, ReferenceLine,
      Tooltip, AreaChart, Area,
    } = Recharts;

    const rows       = [];
    let currentRow   = [];
    let labelRow     = [];

    Object.keys((totals.instances || {})).forEach(instance => {
      if((totals.instances[instance][graph] || []).length){
        this.state.dataKeys.forEach(dataKey => {
          const data    = totals.instances[instance][graph];
          const percent = data[data.length-1][dataKey];
          const span    = this.percentComponent(percent);

          labelRow.push(
            <Col key={instance+"_"+dataKey+"_"+"label"} style={{width:'400px'}}>
              <b>{`${instance.toUpperCase()}`}</b>&nbsp;&nbsp;{`${dataKey}`}&nbsp;({span}%)
            </Col>
          );

          currentRow.push(
            <Col key={instance+"_"+dataKey+"_"+"body"} style={{width:'400px'}}>
              <AreaChart
              width={300}
              height={150}
              data={totals.instances[instance][graph]}
              onClick={() => { this.setState({instance, curDataKey: dataKey, type:'instance'}) }}>
                <XAxis dataKey="name"/>
                <YAxis domain={[0, dataKey === 'mem' ? 100: 200]}/>
                <Tooltip />
                <ReferenceLine y={100} stroke="#D90429" />
                <Area type="monotone" 
                  dataKey={dataKey} stroke="#2c3e50" fill='#2c3e50' dot={false} />
              </AreaChart>
            </Col>
          );
          if(currentRow.length > 3){
            rows.push([currentRow, labelRow]);
            currentRow = [];
            labelRow   = [];
          }
        });
      }
    });
    if(currentRow.length != 0){
      rows.push([currentRow, labelRow]);
    }
    return rows;
  }

  generateButtonClassName(name){
    const className = 'btn btn-primary';
    if(this.state.graph === name){
      return className + ' active';
    }
    return className;
  }

  changeSelectedGraph(name){
    this.setState({ graph: name });
  }

  getPercentColor(percent) {
    function fade(color1, color2, percent) {
      return [
        Math.round(color1[0] + ((color2[0] - color1[0]) * percent)),
        Math.round(color1[1] + ((color2[1] - color1[1]) * percent)),
        Math.round(color1[2] + ((color2[2] - color1[2]) * percent)),
      ];
    }
    const percentColors = [
      [0  , 150, 0],
      [200, 200, 0],
      [255, 0  , 0],
    ];
    if (percent <= 0) {
      return `rgb(${percentColors[0].join(',')})`;
    } else if (percent >= 100) {
      return `rgb(${percentColors[2].join(',')})`;
    } else if (percent === 50) {
      return `rgb(${percentColors[1].join(',')})`;
    } else if (percent < 50) {
      percent = percent / 50;
      const newColor = fade(percentColors[0], percentColors[1], percent);
      return `rgb(${newColor.join(',')})`;
    } else if (percent > 50) {
      percent = (percent - 50) / 50;
      const newColor = fade(percentColors[1], percentColors[2], percent);
      return `rgb(${newColor.join(',')})`;
    } else { console.error('Invalid Percent Color'); }
  }
}