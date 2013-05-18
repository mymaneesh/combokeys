/* jshint es5: true, browser: true, expr: true */
/* globals describe, chai, it, sinon, Mousetrap, KeyEvent, Event */
describe('Mousetrap.bind', function() {
    var expect = chai.expect;

    it('z key fires when pressing z', function() {
        var spy = sinon.spy();

        Mousetrap.bind('z', spy);

        var charCode = 'Z'.charCodeAt(0);

        new KeyEvent({
            charCode: charCode
        }).fire(document);

        // really slow for some reason
        // expect(spy).to.have.been.calledOnce;
        expect(spy.callCount).to.equal(1, 'callback should have been called once');
        expect(spy.args[0][0]).to.be.an.instanceOf(Event, 'first argument should be Event');
        expect(spy.args[0][1]).to.equal('z', 'second argument should be key combo');

        new KeyEvent({
            charCode: charCode
        }, 'keydown').fire(document);

        expect(spy.callCount).to.equal(1, 'callback should not fire from keydown');

        new KeyEvent({
            charCode: charCode
        }, 'keyup').fire(document);

        expect(spy.callCount).to.equal(1, 'callback should not fire from keyup');
    });

    it('z key does not fire when pressing b', function() {
        var spy = sinon.spy();

        Mousetrap.bind('z', spy);

        new KeyEvent({
            charCode: 'B'.charCodeAt(0)
        }).fire(document);

        expect(spy.callCount).to.equal(0);
    });

    it('z key does not fire when holding a modifier key', function() {
        var spy = sinon.spy();
        var modifiers = ['ctrl', 'alt', 'meta', 'shift'];
        var charCode;
        var modifier;

        Mousetrap.bind('z', spy);

        for (var i = 0; i < 4; i++) {
            modifier = modifiers[i];
            charCode = 'Z'.charCodeAt(0);

            // character code is different when alt is pressed
            if (modifier == 'alt') {
                charCode = 'Ω'.charCodeAt(0);
            }

            spy.reset();

            new KeyEvent({
                charCode: charCode,
                modifiers: [modifier]
            }).fire(document);

            expect(spy.callCount).to.equal(0);
        }
    });

    it('rebinding a key overwrites the callback for that key', function() {
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        Mousetrap.bind('x', spy1);
        Mousetrap.bind('x', spy2);

        new KeyEvent({
            charCode: 'X'.charCodeAt(0)
        }).fire(document);

        expect(spy1.callCount).to.equal(0, 'original callback was not called');
        expect(spy2.callCount).to.equal(1, 'new callback was called');
    });

    it('binding an array of keys', function() {
        var spy = sinon.spy();
        Mousetrap.bind(['a', 'b', 'c'], spy);

        new KeyEvent({
            charCode: 'A'.charCodeAt(0)
        }).fire(document);

        expect(spy.callCount).to.equal(1, 'new callback was called');
        expect(spy.args[0][1]).to.equal('a', 'callback should have matched for a');

        new KeyEvent({
            charCode: 'B'.charCodeAt(0)
        }).fire(document);

        expect(spy.callCount).to.equal(2, 'new callback was called twice');
        expect(spy.args[1][1]).to.equal('b', 'callback should have matched for b');

        new KeyEvent({
            charCode: 'C'.charCodeAt(0)
        }).fire(document);

        expect(spy.callCount).to.equal(3, 'new callback was called three times');
        expect(spy.args[2][1]).to.equal('c', 'callback should have matched for c');
    });

    it('binding special characters', function() {
        var spy = sinon.spy();
        Mousetrap.bind('*', spy);

        new KeyEvent({
            charCode: '*'.charCodeAt(0)
        }).fire(document);

        expect(spy.callCount).to.equal(1, 'callback fired once');
        expect(spy.args[0][1]).to.equal('*', 'callback should have matched for *');
    });

    it('binding key combinations', function() {
        var spy = sinon.spy();
        Mousetrap.bind('command+o', spy);
        new KeyEvent({
            keyCode: 79,
            modifiers: ['meta']
        }, 'keydown').fire(document);

        expect(spy.callCount).to.equal(1, 'callback fired once for command+o');
        expect(spy.args[0][1]).to.equal('command+o', 'keyboard string returned is correct');
    });

    it('binding key combos with multiple modifiers', function() {
        var spy = sinon.spy();
        Mousetrap.bind('command+shift+o', spy);
        new KeyEvent({
            keyCode: 79,
            modifiers: ['meta']
        }, 'keydown').fire(document);
        expect(spy.callCount).to.equal(0, 'callback not fired for command+o');

        new KeyEvent({
            keyCode: 79,
            modifiers: ['meta']
        }, 'keydown').fire(document);
    });

    it('return false should prevent default and stop propagation', function() {
        var spy = sinon.spy(function() {
            return false;
        });

        Mousetrap.bind('command+s', spy);
        new KeyEvent({
            keyCode: 83,
            modifiers: ['meta']
        }, 'keydown').fire(document);

        expect(spy.callCount).to.equal(1, 'callback should have fired');
        expect(spy.args[0][0]).to.be.an.instanceOf(Event, 'first argument should be Event');
        expect(spy.args[0][0].cancelBubble).to.be.true;
        expect(spy.args[0][0].defaultPrevented).to.be.true;

        // try without return false
        spy = sinon.spy();
        Mousetrap.bind('command+s', spy);
        new KeyEvent({
            keyCode: 83,
            modifiers: ['meta']
        }, 'keydown').fire(document);

        expect(spy.callCount).to.equal(1, 'callback should have fired');
        expect(spy.args[0][0]).to.be.an.instanceOf(Event, 'first argument should be Event');
        expect(spy.args[0][0].cancelBubble).to.be.false;
        expect(spy.args[0][0].defaultPrevented).to.be.false;
    });

    it('binding sequences', function() {
        var spy = sinon.spy();
        Mousetrap.bind('g i', spy);

        new KeyEvent({
            charCode: 'G'.charCodeAt(0)
        }).fire(document);
        expect(spy.callCount).to.equal(0, 'callback should not have fired');

        new KeyEvent({
            charCode: 'I'.charCodeAt(0)
        }).fire(document);
        expect(spy.callCount).to.equal(1, 'callback should have fired');
    });

    it.skip('key within sequence should not fire');

    it.skip('keyup at end of sequence should not fire');

    it.skip('broken sequences');

    it.skip('sequence timeout');

    it.skip('check defaults');
});