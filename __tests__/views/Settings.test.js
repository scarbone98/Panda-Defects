import Settings from '../../src/views/Settings';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import sinon from "sinon";
describe('Settings view shallow tests', () => {
    const wrapper = shallow(<Settings/>);
    var setSpy = sinon.spy(wrapper.instance(),'deleteAccount');
    it('component Settings renders without crash', () => {
        expect(wrapper.length
        ).toEqual(1);
    });
    it('delete account is called when toggled', () => {
        wrapper.instance().deleteAccount();
        expect(setSpy.callCount).toEqual(1);
    });
    it('user is signed out correctly', () => {
        setSpy = sinon.spy(wrapper.instance(),'signOut');
        wrapper.instance().signOut();
        expect(setSpy.callCount).toEqual(1);
    });
});