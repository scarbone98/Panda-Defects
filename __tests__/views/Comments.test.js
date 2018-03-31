import Comments from '../../src/views/Comments';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';
import sinon from "sinon";
describe('Comments view shallow tests', () => {
    const wrapper = mount(<Comments/>);
    it('component CommentsView renders without crash', () => {
        expect(wrapper.length
        ).toEqual(1);
    });
    //Does not execute properly because test depends on query string which can't be passed
    it('load comments function is correctly executed without exceptions', ()=>{
        let setSpy = sinon.spy(wrapper.instance(),'loadComments');
        wrapper.instance().loadComments();
        expect(setSpy.callCount).toEqual(1);
    });
});