import Top from '../../src/views/Top';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import sinon from "sinon";
describe('TopPosts view shallow tests', () => {
    const wrapper = shallow(<Top/>);
    var setSpy = sinon.spy(wrapper.instance(),'loadPosts');
    it('component TopPosts renders without crash', () => {
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