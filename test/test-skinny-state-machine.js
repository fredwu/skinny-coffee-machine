(function() {

  describe('Skinny Coffee Machine', function() {
    beforeEach(function() {
      var self;
      self = this;
      this.coffeeMachine = {};
      this.actionPerformed = [];
      this.coffeeMachine.power = new SkinnyCoffeeMachine({
        "default": 'off',
        events: {
          turnOn: {
            off: 'on'
          },
          turnOff: {
            on: 'off'
          }
        },
        on: {
          turnOn: function(from, to) {
            return self.actionPerformed.push("" + (from.toUpperCase()) + " to " + (to.toUpperCase()));
          },
          turnOff: function(from, to) {
            return self.actionPerformed.push("" + (from.toUpperCase()) + " to " + (to.toUpperCase()));
          }
        },
        before: {
          turnOff: function(from, to) {
            return self.actionPerformed.push("Before switching to " + (to.toUpperCase()));
          }
        },
        after: {
          turnOn: function(from, to) {
            return self.actionPerformed.push("After switching to " + (to.toUpperCase()));
          },
          turnOff: function(from, to) {
            return self.actionPerformed.push("After switching to " + (to.toUpperCase()));
          }
        }
      });
      return this.coffeeMachine.mode = new SkinnyCoffeeMachine({
        "default": 'latte',
        events: {
          next: {
            latte: 'cappuccino',
            cappuccino: 'espresso',
            espresso: 'lungo',
            lungo: 'latte'
          },
          last: {
            latte: 'lungo',
            lungo: 'espresso',
            espresso: 'cappuccino',
            cappuccino: 'latte'
          }
        }
      });
    });
    afterEach(function() {
      return this.actionPerformed = [];
    });
    describe('States', function() {
      it('lists all states', function() {
        this.coffeeMachine.power.allStates().should.eql(['off', 'on']);
        return this.coffeeMachine.mode.allStates().should.eql(['latte', 'cappuccino', 'espresso', 'lungo']);
      });
      it('gets the default state', function() {
        this.coffeeMachine.power.defaultState().should.eql('off');
        return this.coffeeMachine.mode.defaultState().should.eql('latte');
      });
      it('changes state', function() {
        this.coffeeMachine.power.currentState().should.eql('off');
        this.coffeeMachine.power["switch"]('turnOn');
        this.coffeeMachine.power.currentState().should.eql('on');
        this.coffeeMachine.mode.currentState().should.eql('latte');
        this.coffeeMachine.mode.change('next');
        this.coffeeMachine.mode.currentState().should.eql('cappuccino');
        this.coffeeMachine.mode.change('last');
        return this.coffeeMachine.mode.currentState().should.eql('latte');
      });
      return it('changes state multiple times', function() {
        this.coffeeMachine.mode.currentState().should.eql('latte');
        this.coffeeMachine.mode.change('next').change('next').change('next').change('next');
        this.coffeeMachine.mode.currentState().should.eql('latte');
        this.coffeeMachine.mode.change('next', 4);
        return this.coffeeMachine.mode.currentState().should.eql('latte');
      });
    });
    describe('Events', function() {
      return it('performs actions when change the state', function() {
        this.actionPerformed.should.eql([]);
        this.coffeeMachine.power["switch"]('turnOn');
        this.actionPerformed.should.eql(['OFF to ON', 'After switching to ON']);
        this.actionPerformed = [];
        this.coffeeMachine.power["switch"]('turnOff');
        return this.actionPerformed.should.eql(['Before switching to OFF', 'ON to OFF', 'After switching to OFF']);
      });
    });
    return describe('Observers', function() {
      it('observes before an event', function() {
        var _this = this;
        this.coffeeMachine.power.observeBefore('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A before switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power.observeBefore('turnOn').start('B', function(from, to) {
          return _this.actionPerformed.push("Observer B before switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power["switch"]('turnOn');
        return this.actionPerformed.should.eql(['Observer A before switching to ON', 'Observer B before switching to ON', 'OFF to ON', 'After switching to ON']);
      });
      it('observes on an event', function() {
        var _this = this;
        this.coffeeMachine.power.observeBefore('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A before switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power.observeOn('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A on switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power["switch"]('turnOn');
        return this.actionPerformed.should.eql(['Observer A before switching to ON', 'OFF to ON', 'Observer A on switching to ON', 'After switching to ON']);
      });
      it('observes after an event', function() {
        var _this = this;
        this.coffeeMachine.power.observeAfter('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A after switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power["switch"]('turnOn');
        return this.actionPerformed.should.eql(['OFF to ON', 'After switching to ON', 'Observer A after switching to ON']);
      });
      it('stops an observer worker', function() {
        var _this = this;
        this.coffeeMachine.power.observeBefore('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A before switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power.observeBefore('turnOn').start('B', function(from, to) {
          return _this.actionPerformed.push("Observer B before switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power.observeAfter('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A after switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power["switch"]('turnOn');
        this.actionPerformed.should.eql(['Observer A before switching to ON', 'Observer B before switching to ON', 'OFF to ON', 'After switching to ON', 'Observer A after switching to ON']);
        this.coffeeMachine.power.observeBefore('turnOn').stop('A');
        this.coffeeMachine.power["switch"]('turnOff');
        this.actionPerformed = [];
        this.coffeeMachine.power["switch"]('turnOn');
        return this.actionPerformed.should.eql(['Observer B before switching to ON', 'OFF to ON', 'After switching to ON', 'Observer A after switching to ON']);
      });
      it('prevents duplicated observer workers', function() {
        var _this = this;
        this.coffeeMachine.power.observeAfter('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A after switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power.observeAfter('turnOn').start('A', function(from, to) {
          return _this.actionPerformed.push("Observer A (NEW) after switching to " + (to.toUpperCase()));
        });
        this.coffeeMachine.power["switch"]('turnOn');
        return this.actionPerformed.should.eql(['OFF to ON', 'After switching to ON', 'Observer A (NEW) after switching to ON']);
      });
      return it('silently ignores the stop request when the observer worker is not running', function() {
        return this.coffeeMachine.power.observeBefore('turnOn').stop('A');
      });
    });
  });

}).call(this);
