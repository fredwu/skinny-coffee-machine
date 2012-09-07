# Skinny Coffee Machine [![endorse](http://api.coderwall.com/fredwu/endorsecount.png)](http://coderwall.com/fredwu) [![Build Status](https://secure.travis-ci.org/fredwu/skinny-coffee-machine.png?branch=master)](http://travis-ci.org/fredwu/skinny-coffee-machine)

### A simple JavaScript state machine with observers, for browsers and Node.js.

Skinny Coffee Machine is a simple JavaScript state machine written in CoffeeScript. It is being developed for the 2.0 rewrite of [jQuery Endless Scroll](https://github.com/fredwu/jquery-endless-scroll).

## NPM

If you use [npm](https://npmjs.org/), you can grab the source code by:

```
npm install skinny-coffee-machine
```

## Usage

### Define State Machines

```coffeescript
@coffeeMachine.power = new SkinnyCoffeeMachine
  default: 'off'
  events:
    turnOn:
      off: 'on'
    turnOff:
      on: 'off'
  on:
    turnOn:  (from, to) -> "#{from.toUpperCase()} to #{to.toUpperCase()}"
    turnOff: (from, to) -> "#{from.toUpperCase()} to #{to.toUpperCase()}"
  before:
    turnOff: (from, to) -> "Before switching to #{to.toUpperCase()}"
  after:
    turnOn:  (from, to) -> "After switching to #{to.toUpperCase()}"
    turnOff: (from, to) -> "After switching to #{to.toUpperCase()}"

@coffeeMachine.mode = new SkinnyCoffeeMachine
  default: 'latte'
  events:
    next:
      latte: 'cappuccino'
      cappuccino: 'espresso'
      espresso: 'lungo'
      lungo: 'latte'
    last:
      latte: 'lungo'
      lungo: 'espresso'
      espresso: 'cappuccino'
      cappuccino: 'latte'
```

### Switch/Change States

You may use either `switch` or `change` for switching states:

```coffeescript
@coffeeMachine.power.currentState() #=> "off"

@coffeeMachine.power.switch('turnOn')

@coffeeMachine.power.currentState() #=> "on"
```

To change states multiple times:

```coffeescript
@coffeeMachine.mode.currentState() #=> "latte"

@coffeeMachine.mode.change('next', 3)

@coffeeMachine.mode.currentState() #=> "cappuccino"
```

### Observers

In order to provide more flexibility on state transition callbacks, you may use observers to dynamically add and remove events.

To start observing:

```coffeescript
@coffeeMachine.power.observeBefore('turnOn').start 'labelA', (from, to) => "Observer A before switching to #{to.toUpperCase()}"
@coffeeMachine.power.observeOn(    'turnOn').start 'labelB', (from, to) => "Observer B on switching to #{to.toUpperCase()}"
@coffeeMachine.power.observeAfter( 'turnOn').start 'labelC', (from, to) => "Observer C after switching to #{to.toUpperCase()}"
```

To stop observing:

```coffeescript
@coffeeMachine.power.observeBefore('turnOn').stop('labelA')
```

## Contribute

Skinny Coffee Machine uses [Grunt](http://gruntjs.com/), [PhantomJS](http://phantomjs.org/) and [Mocha](http://visionmedia.github.com/mocha/).

After you have Grunt and PhantomJS set up, you may run tests by:

```
grunt
```

To automatically compile CoffeeScript as well as run tests during development, you may use:

```
grunt watch
```

## License

Copyright (c) 2012 [Fred Wu](http://fredwu.me/)

Licensed under the [MIT license](http://fredwu.mit-license.org/).
