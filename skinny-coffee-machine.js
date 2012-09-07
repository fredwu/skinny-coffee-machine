
/*
 Skinny Coffee Machine - a simple state machine written in CoffeeScript

 Copyright (c) 2012 Fred Wu

 Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php

 See the test file for usage examples.
*/


(function() {
  var SkinnyCoffeeMachine, SkinnyLogger, SkinnyObserver, SkinnyObserverWorker, root,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  SkinnyCoffeeMachine = (function() {

    function SkinnyCoffeeMachine(states) {
      this.states = states != null ? states : {};
      this.__previousState = null;
      this.__currentState = this.defaultState();
      this.observer = new SkinnyObserver(this);
    }

    SkinnyCoffeeMachine.prototype.defaultState = function() {
      return this.states["default"];
    };

    SkinnyCoffeeMachine.prototype.previousState = function() {
      return this.__previousState;
    };

    SkinnyCoffeeMachine.prototype.currentState = function() {
      return this.__currentState;
    };

    SkinnyCoffeeMachine.prototype.allStates = function() {
      var event, state, _allStates;
      _allStates = [];
      for (event in this.states.events) {
        for (state in this.states.events[event]) {
          if (__indexOf.call(_allStates, state) < 0) {
            _allStates.push(state);
          }
        }
      }
      return _allStates;
    };

    SkinnyCoffeeMachine.prototype.change = function(event, timesToRepeat) {
      if (timesToRepeat == null) {
        timesToRepeat = 1;
      }
      return this["switch"](event, timesToRepeat);
    };

    SkinnyCoffeeMachine.prototype["switch"] = function(event, timesToRepeat) {
      var _i;
      if (timesToRepeat == null) {
        timesToRepeat = 1;
      }
      for (_i = 1; 1 <= timesToRepeat ? _i <= timesToRepeat : _i >= timesToRepeat; 1 <= timesToRepeat ? _i++ : _i--) {
        this._switchOnce(event);
      }
      return this;
    };

    SkinnyCoffeeMachine.prototype._switchOnce = function(event) {
      this.__previousState = this.currentState();
      this.__currentState = this.states.events[event][this.previousState()];
      this._callAction('before', event);
      this.observer.act('before', event);
      this._callAction('on', event);
      this.observer.act('on', event);
      this._callAction('after', event);
      this.observer.act('after', event);
      return this;
    };

    SkinnyCoffeeMachine.prototype._callAction = function(eventType, event) {
      if (this.states[eventType] && typeof this.states[eventType][event] === 'function') {
        return this.states[eventType][event].call(this, this.previousState(), this.currentState());
      }
    };

    SkinnyCoffeeMachine.prototype.observeBefore = function(event) {
      return this.observer.observe('before', event);
    };

    SkinnyCoffeeMachine.prototype.observeOn = function(event) {
      return this.observer.observe('on', event);
    };

    SkinnyCoffeeMachine.prototype.observeAfter = function(event) {
      return this.observer.observe('after', event);
    };

    return SkinnyCoffeeMachine;

  })();

  SkinnyObserver = (function() {

    function SkinnyObserver(sm) {
      this.sm = sm;
      this.observers = {};
    }

    SkinnyObserver.prototype.act = function(eventType, event) {
      var callback, label, _ref, _results;
      if (this.observers[eventType] && this.observers[eventType][event]) {
        _ref = this.observers[eventType][event];
        _results = [];
        for (label in _ref) {
          callback = _ref[label];
          _results.push(callback.call(this, this.sm.previousState(), this.sm.currentState()));
        }
        return _results;
      }
    };

    SkinnyObserver.prototype.observe = function(eventType, event) {
      return new SkinnyObserverWorker(this, eventType, event);
    };

    return SkinnyObserver;

  })();

  SkinnyObserverWorker = (function() {

    function SkinnyObserverWorker(observer, eventType, event) {
      var _base, _base1, _name, _name1, _ref, _ref1;
      this.observer = observer;
      this.eventType = eventType;
      this.event = event;
      if ((_ref = (_base = this.observer.observers)[_name = this.eventType]) == null) {
        _base[_name] = {};
      }
      if ((_ref1 = (_base1 = this.observer.observers[this.eventType])[_name1 = this.event]) == null) {
        _base1[_name1] = {};
      }
    }

    SkinnyObserverWorker.prototype.start = function(label, callback) {
      return this.observer.observers[this.eventType][this.event][label] = callback;
    };

    SkinnyObserverWorker.prototype.stop = function(label) {
      return delete this.observer.observers[this.eventType][this.event][label];
    };

    return SkinnyObserverWorker;

  })();

  SkinnyLogger = (function() {

    function SkinnyLogger(logger) {
      this.logger = logger != null ? logger : {};
    }

    return SkinnyLogger;

  })();

  root = this;

  if (typeof module === 'undefined') {
    root.SkinnyCoffeeMachine = SkinnyCoffeeMachine;
  } else {
    module.exports = SkinnyCoffeeMachine;
  }

}).call(this);
