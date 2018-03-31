import Login from '../../src/views/Login';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import sinon from "sinon";
describe('Login view shallow tests', () => {
    const wrapper = shallow(<Login/>);
    var setSpy = sinon.spy(wrapper.instance(),'registerUser');
    it('component Login renders without crash', () => {
        expect(wrapper.length
        ).toEqual(1);
    });
    it('register user is called correctly', () => {
        wrapper.instance().registerUser();
        expect(setSpy.callCount).toEqual(1);
    });
    it('signIn user is called correctly', () => {
        setSpy = sinon.spy(wrapper.instance(),'signInUser');
        wrapper.instance().signInUser();
        expect(setSpy.callCount).toEqual(1);
    });
});