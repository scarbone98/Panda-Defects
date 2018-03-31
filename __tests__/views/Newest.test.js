import Newest from '../../src/views/Newest';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import sinon from "sinon";
describe('NewestPosts view shallow tests', () => {
    const wrapper = shallow(<Newest/>);
    var setSpy = sinon.spy(wrapper.instance(),'loadPosts');
    it('component NewestPost renders without crash', () => {
        expect(wrapper.length
        ).toEqual(1);
    });
    it('posts are loaded into the page', () => {
        wrapper.instance().loadPosts();
        expect(setSpy.callCount).toEqual(1);
    });
    it('refresh icon is rendered properly', () => {
        setSpy = sinon.spy(wrapper.instance(),'renderRefresh');
        wrapper.instance().renderRefresh();
        expect(setSpy.callCount).toEqual(1);
    });
});