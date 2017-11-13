import React, { Component } from 'react';
import './Form.css';
import {isEmpty, noop, trim} from 'lodash';
import {emojiAdder} from './emojiAdder';

class Field extends Component {
  render() {
    const {id, label, type, focus, value, onChange=noop} = this.props;
    return (
      <dl>
        <dt className ={type === 'textarea' ? 'label arealabel': 'label'}>
          <label htmlFor={id}>{label}</label>
        </dt>
        <dd className ='field'>
          {type === 'textarea'
            ? <textarea
                placeholder="Например, секс🙈 & наркотики💉 & рок-н-ролл🎸 "
                onChange={e => onChange(e.target.value, e.target.selectionStart)}
                value={value}
                rows='9' cols='53' type="text" id={id} />
            : <input
                onChange={e => onChange(e.target.value, e.target.selectionStart)}
                value={value}
                ref={x => x && focus ? x.focus() : null}
                className='input' size='45' type="text" id={id} />}
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
            ? <span className='warning'>Осталось заполнить: {this._renderLinks(links)}</span>
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
      resume: '',
      isNameFocused: false,
      isEmailFocused: false,
      links: ['name', 'email'],
    };
    this.emojiAdder = emojiAdder();
  }

  _getLinks(changedData) {
    const {name, email} = this.state;
    const obj = Object.assign({name, email}, changedData);
    return [
      isEmpty(trim(obj.name)) ? 'name' : null,
      !/\S+@\S+\.\S+/.test(obj.email) ? 'email' : null,
    ].filter(Boolean);
  }

  _onFieldChange(field, value, pos) {
    const links = this._getLinks({[field]: value});
    this.setState({
      [field]: this.emojiAdder(value, pos),
      links,
      isNameFocused: field === 'name',
      isEmailFocused: field === 'email',
    });
  }

  render() {
    const {links, name, email, phone, resume} = this.state;
    return (
      <div className='main'>
        <div className='left'>
          <Field
            value={name}
            onChange={(value, pos) => this._onFieldChange('name', value, pos)}
            id='name'
            label='Имя:'
            focus={this.state.isNameFocused}/>
          <Field
            value={email}
            onChange={(value, pos) => this._onFieldChange('email', value, pos)}
            id='email'
            label='Эл. почта:'
            focus={this.state.isEmailFocused} />
          <Field
            onChange={(value, pos) => this._onFieldChange('phone', value, pos)}
            value={phone}
            id='phone'
            label='Телефон:' />
          <Field
            value={resume}
            onChange={(value, pos) => this._onFieldChange('resume', value, pos)}
            type='textarea'
            id='resume'
            label='Рассказ о себе:' />
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
