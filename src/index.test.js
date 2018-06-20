import test from 'ava'
import browserEnv from 'browser-env'

import { $, $$ } from '../dist/index.js'

browserEnv()

test.afterEach.always(t => {
  document.body.innerHTML = ''
})

test('$("div")', t => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  t.is($('div'), div)
  t.pass()
})

test('$(node)', t => {
  const div = document.createElement('div')

  t.truthy($(div).on)
  t.truthy($(div).setAttributes)
  t.pass()
})

test('$("bad_query")', t => {
  t.truthy($('bad') == null)
  t.pass()
})

test('$("div", parent)', t => {
  const div = document.createElement('div')
  const p = document.createElement('p')

  div.appendChild(p)
  div.appendChild(p)

  t.is($('p', div), p)
  t.pass()
})

test('$$("div")', t => {
  const div = document.createElement('div')
  const len = 3

  for (var i = 0; i < len; i++)
    document.body.appendChild(div)

  t.is($$('div').length, len - 1)
  t.pass()
})

test('$$(nodes)', t => {
  const div = document.createElement('div')
  const len = 3

  for (var i = 0; i < len; i++)
    document.body.appendChild(div)

  const nodes = document.querySelectorAll('div')

  t.truthy($$(nodes).on)
  t.truthy($$(nodes).setAttributes)
  t.pass()
})

test('$$("bad_query")', t => {
  t.truthy($$('nothing') == null)
  t.pass()
})

test('$$("div", parent)', t => {
  const div = document.createElement('div')
  const p = document.createElement('p')
  const len = 3

  for (var i = 0; i < len; i++)
    div.appendChild(p)

  t.is($$('p', div).length, div.querySelectorAll('p').length)
  t.pass()
})

test('$$("p").map(el => ...)', t => {
  const div = document.createElement('div')
  const p = document.createElement('p')
  const len = 3

  for (var i = 0; i < len; i++)
    document.body.appendChild(p)

  t.is($$('p').map, Array.prototype.map)
  t.is($$('p').filter, Array.prototype.filter)
  t.is($$('p').reduce, Array.prototype.reduce)
  t.pass()
})

test('$("button").setAttributes({...})', t => {
  const btn = document.createElement('button')

  document.body.appendChild(btn)

  t.falsy(btn.hasAttribute('foo'))
  $('button').setAttributes({
    foo: 'bar'
  })
  t.truthy(btn.hasAttribute('foo'))

  t.pass()
})

test('$$("button").setAttributes({...})', t => {
  const btn = document.createElement('button')

  document.body.appendChild(btn)
  document.body.appendChild(btn)

  t.falsy(btn.hasAttribute('foo'))
  $$('button').setAttributes({
    foo: 'bar'
  })
  t.truthy(btn.hasAttribute('foo'))
  
  t.pass()
})

test.cb('$("button").on("click", e => ...)', t => {
  const btn = document.createElement('button')
  btn.classList.add('test')
  document.body.appendChild(btn)

  $('.test').on('click', e => t.end())
  btn.click()
})

test('$("button").on("click ...", e => ...)', t => {
  t.plan(2)

  const btn = document.createElement('button')

  $(btn).on('click dblclick', e => t.pass())
  btn.click()
  btn.dispatchEvent(new window.MouseEvent('dblclick', {
    bubbles: true
  }))
})

test.cb('$(node).on("click", e => ...)', t => {
  const btn = document.createElement('button')

  $(btn).on('click', e => t.end())
  btn.click()
})

test.cb('$$("button").on("click", e => ...)', t => {
  const btn = document.createElement('button')
  btn.classList.add('test')

  document.body.appendChild(btn)
  document.body.appendChild(btn)

  $$('.test').on('click', e => t.end())
  btn.click()
})

test('$$("button").on("click ...", e => ...)', t => {
  t.plan(2)

  const btn = document.createElement('button')
  document.body.appendChild(btn)
  document.body.appendChild(btn)
  const list = document.querySelectorAll('button')

  $$(list).on('click dblclick', e => t.pass())
  btn.click()
  btn.dispatchEvent(new window.MouseEvent('dblclick', {
    bubbles: true
  }))
})

test.cb('$$(node).on("click", e => ...)', t => {
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  document.body.appendChild(btn)
  const list = document.querySelectorAll('button')

  $$(list).on('click', e => t.end())
  btn.click()
})