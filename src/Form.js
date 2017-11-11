import React, { Component } from 'react';
import './Form.css';
import {isEmpty, noop} from 'lodash';

class Field extends Component {
  render() {
    const {id, label, type, focus, onChange=noop, value} = this.props;
    return (
      <dl>
        <dt className ='label'><label htmlFor={id}>{label}</label></dt>
        <dd className ='field'>
          {type === 'textarea'
            ? <textarea rows='9' cols='58' type="text" id={id} />
            : <input
                value={value}
                onChange={e => onChange(e.target.value)}
                ref={x => x && focus ? x.focus() : null}
                className='input' size='50' type="text" id={id} />}
        </dd>
      </dl>
    );
  }
}

class Actions extends Component {
  render() {
    const {links} = this.props;
    return (
      <dl>
        <dd className ='field'>
          <button className='button'>Отправить</button>
          {!isEmpty(links)
            ? <span className='warning'> Осталось заполнить: {this._renderLinks(links)}</span>
            : ''}
        </dd>
      </dl>
    );
  }

  _onClick(link) { this.props.onClick(link); }
  _renderLink(link, i, last) {
    return (
      <span key={link}>
        <span className='link' key={i}
          onClick={() => this._onClick(link)} >
          {link === 'name' ? 'имя' : 'эл. почта'}
        </span>
        {i === last ? '' : ', ' }
      </span>
    );
  }

  _renderLinks(links) {
    const last = links.length - 1;
    return links.map((link, i) => this._renderLink(link, i, last));
  }
}

class Form extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      isNameFocused: false,
      isEmailFocused: false,
      links: ['name', 'email'],
    };
  }

  _getLinks(changed) {
    const {name, email} = this.state;
    const obj = Object.assign({name, email}, changed);
    return [
      isEmpty(obj.name) ? 'name' : null,
      !/\S+@\S+\.\S+/.test(obj.email) ? 'email' : null,
    ].filter(Boolean);
  }

  _onFieldChange(field, value) {
    const links = this._getLinks({[field]: value});
    this.setState({
      [field]: value,
      links,
      isNameFocused: field === 'name',
      isEmailFocused: field === 'email',
    });
  }

  render() {
    const {links, name, email, phone} = this.state;
    return (
      <div className='main'>
        <div className='left'>
          <Field
            value={name}
            onChange={value => this._onFieldChange('name', value)}
            id='name'
            label='Имя:'
            focus={this.state.isNameFocused}/>
          <Field
            value={email}
            onChange={value => this._onFieldChange('email', value)}
            id='email'
            label='Эл. почта:'
            focus={this.state.isEmailFocused} />
          <Field
            onChange={value => this._onFieldChange('phone', value)}
            value={phone}
            id='phone'
            label='Телефон:' />
          <Field type='textarea' id='resume' label='Рассказ о себе:' />
          <Actions links={links} onClick={this._onLinkClick.bind(this)}/>
        </div>
        <div></div>
      </div>
    );
  }

  _onLinkClick(field) {
    this.setState({
      isNameFocused: field === 'name',
      isEmailFocused: field === 'email',
    })
  }
}

export default Form;
