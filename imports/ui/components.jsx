import {Random} from 'meteor/random';
import React    from 'react';

export const Button = (props) => {
  let {
    text, disabled, size, type, style, className, onClick, ...passProps
  } = props;

  if(!style){ style = {}; }

  if(!className){
    if     (type === 'danger' ){ className = 'btn btn-danger';  }
    else if(type === 'warning'){ className = 'btn btn-warning'; }
    else if(type === 'default'){ className = 'btn btn-default'; }
    else if(type === 'success'){ className = 'btn btn-success'; }
    else{                        className = 'btn btn-primary'; }
  }

  if(size){ className += ` ${size}`; }

  return (
    <button
    {...passProps}
    style={style}
    onClick={onClick}
    className={className}
    disabled={disabled}>
      {text}
    </button>
  );
}

export const Grid = (props) => {
  let {style} = props;
  if(!style){ style = {}; }
  if(!style.width){ style.width = '100%'}

  return (
    <div
      style={style}
      className='Grid'
      hidden={props.hidden}>

      {props.children}

    </div>
  )
}

export const Col = (props) => {
  return (
    <div className='Col' style={props.style || {}} hidden={props.hidden}>
      {props.children}
    </div>
  );
}

export const Row = (props) => {
  return (
    <div className='Row' style={props.style || {}} hidden={props.hidden} >
      {props.children}
    </div>
  )
}

export const Table = (props) => {
  const {headers, children, style, theadStyle, tbodyStyle} = props;

  return(
    <table style={style} className='table table-striped table-hover'>
      <thead style={theadStyle}><tr>
        {headers.map((item, i) => {
          return(
            <th key={i} >
              {item.name}
            </th>
          );
        })}
      </tr></thead>

      <tbody style={tbodyStyle}>
        {children}
      </tbody>
    </table>
  )
}

export const Td = (props) => {
  let {
    just,      right,  center, style,   children,
    multiline, valign, onClick, minHeight,
  } = props;

  if(!style){ style = {}; }
  if(right           ){ style.textAlign     = 'right';    }

  if(center){
    return (
      <td style={style} onClick={onClick}>
        <center>{children}</center>
      </td>
    )
  }

  return (
    <td style={style} onClick={onClick}>
      {children}
    </td>
  )
}

export const Fieldset = (props) => {
  let {name, hidden, headerExtra, headerExtraFloat, children, padding, title} = props;

  if(!padding) padding = '0px';
  if(!headerExtraFloat) headerExtraFloat = 'right';

  let style = {};
  return(
    <fieldset style={style} title={title}>
      <legend>
        <div style={{ float: 'left' }}>{name}</div>
        <div style={{ float: headerExtraFloat, paddingLeft: '10px' }}>
          {headerExtra}
        </div>
        &nbsp;
      </legend>

      <div style={{ paddingLeft: padding }}>
        {children}
      </div>

    </fieldset>
  )
}

import DropdownList from 'react-widgets/lib/DropdownList'
export class FormDropdownList extends React.Component{
  constructor(props){super(props);
    this.item = props.defaultValue || {};
  }

  onChange(value){
    this.item = value;
    const { onChange } = this.props;
    if (onChange) {
      this.props.onChange(value); }
  }

  render(){
    let { style, items, name,FGRpadding,
      fieldStyle, title, nameSize, ...passProps} = this.props;
    if(!items ){ items = []; }
    if(!style ){ style = {}; }

    const id = `${Random.id(16)}${name}`;

    let nameClass = 'col-lg-2 control-label';
    if(nameSize){ nameClass = `col-lg-${nameSize} control-label`; }
    if(!style){ style = {}; }

    return(
      <GroupRow paddingLeft={FGRpadding} style={fieldStyle}>
        <label
          htmlFor={id}
          title={title}
          className={nameClass}>{name} </label>
        <DropdownList {...passProps } 
        style={style} data={items} 
        onChange={this.onChange.bind(this)} />
      </GroupRow>
    );
  }
}
export class TextValue extends React.Component{
  constructor(props){
    super(props);

    this.loaded = false;
    this.hasFocus = false;
    this.lastValue = props.value;
    this.lastCarret = 0;
    this.getValue = this.getValue;
  }
  componentDidMount(){ this.loaded = true; }

  checkProps(value){
    if(this.loaded && value !== undefined && this.hasFocus){
      let {textRef} = this.refs;
      textRef.value = value; this.lastValue = value;
      textRef.selectionStart = textRef.selectionEnd = this.lastCaret;
    }
  }

  render(){
    let {FGRpadding, FGWclassName, fieldStyle, title, style, ...passProps} = this.props;
    const {name, type, disabled, value, defaultValue, placeholder, onChange} = this.props;
    this.checkProps(value);
    if(!style){ style = {}; }
    if(!fieldStyle){ fieldStyle = {}; }

    let nameClass = 'col-lg-2 control-label';
    if(!style){ style = {}; }
    const id = `${Random.id(16)}${name}`;

    return (
      <GroupRow paddingLeft={FGRpadding} style={fieldStyle}>
        <label
          htmlFor={id}
          title={title}
          className={nameClass}>{name} </label>
        <input
          {...passProps}
          id={id} ref='textRef'
          type={type || 'text'}
          className='form-control'
          placeholder={placeholder}
          style={style} title={title}
          defaultValue={value || defaultValue}
          onChange={this.onChange.bind(this)} />
      </GroupRow>
    );
  }
  onChange(){
    if(this.props.onChange){
      this.lastCaret = this.refs.textRef.selectionStart;
      this.props.onChange(this.refs.textRef.value);
    }
  }
}

export const UsernameInput = (props) => {
  const {style, onChange, onKeyDown, placeholder, defaultValue} = props;
  inputStyle = style || {};
  inputStyle.marginTop = '10px';
  return(
    <input
    type='text'
    style={inputStyle}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className='form-control'
    placeholder={placeholder}
    defaultValue={defaultValue} />
  );
}
export const PasswordInput = (props) => {
  const {style, onChange, onKeyDown, placeholder, className } = props;
  inputStyle = style || {};
  inputStyle.marginTop = '10px';
  return(
    <input
    id="input"
    type='password'
    style={inputStyle}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={className?className:'form-control'} />
  );
}

export const FormError = (props) => {
  let { color, message, float } = props;
  if(!color) color = 'red';
  let style = { 'color': color, 'whiteSpace': 'pre-line' };
  if(float) style.float = float;

  return (
    <span style={style}>
      {message}
    </span>
  )
}

export const GroupRow = (props) => {
  const {children} = props;
  let {className, style, paddingLeft, paddingRight, error} = props;

  if(!style) style = {};
  if(!paddingLeft) paddingLeft = '15px';
  if(!className) className = 'form-group row';
  if(error) className += ' has-error';

  if(!style.paddingLeft){ style.paddingLeft = paddingLeft; }
  if(!style.paddingRight){ style.paddingRight = paddingRight; }

  return(
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export class TextArea extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      shouldScroll: false
    }
  }
  componentDidMount(){
    if(this.refs.inputRef){
      this.scrollToBottom();
    }
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps !== this.props){
      if(this.refs.inputRef){
        let ref = this.refs.inputRef;
        if((ref.scrollTop + ref.offsetHeight) / ref.scrollHeight * 100 >= 100){
          this.setState({shouldScroll: true});
        }else{
          this.setState({shouldScroll: false});
        }
      }
    }
  }

  render(){
    const {lockScrollX, lockScrollY, rows, cols, readOnly} = this.props;
    const {name, disabled, value, placeholder,
      FGRpadding,onChange} = this.props;
    let {fieldStyle, title, nameSize, fieldSize, style} = this.props;

    if(lockScrollX && !lockScrollY) style.resize = 'vertical';
    if(lockScrollY && !lockScrollY) style.resize = 'horizontal';

    let nameClass = 'col-lg-2 control-label';
    if(fieldSize){ fieldClass = `col-lg-${fieldSize}`; }
    if(nameSize){ nameClass = `col-lg-${nameSize} control-label`; }
    if(!style){ style = {}; }
    if(!fieldStyle){ fieldStyle = {}; }
    
    const id = `${Random.id(16)}${name}`;
    return (
      <GroupRow paddingLeft={FGRpadding} style={fieldStyle}>
        <label
          htmlFor={id}
          title={title}
          className={nameClass}>{name} </label>
        <textarea
          rows={rows}
          cols={cols}
          style={style}
          ref="inputRef"
          id="inputTextArea"
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
          className="form-control"
          placeholder={placeholder}
          value={value} />
      </GroupRow>
    );
  }
  scrollToBottom(forced = false){
    if((this.refs.inputRef && this.state.shouldScroll) || forced){
      this.refs.inputRef.scrollTop = this.refs.inputRef.scrollHeight;
    }
  }
}
