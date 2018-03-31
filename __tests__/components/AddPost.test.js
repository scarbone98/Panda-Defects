import AddPost from '../../src/components/AddPost';
import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
describe('AddPost component tests', () => {
    const wrapper = shallow(<AddPost isComment={true}/>);
    var setSpy = sinon.spy(wrapper.instance(),'createComment');
    it('component AddPost renders without crash', () => {
        expect(wrapper.length
        ).toEqual(1);
    });
    it('creates Comment correctly', () => {
        wrapper.instance().createComment();
        expect(setSpy.callCount).toEqual(1);
    });
    it('creates Post correctly', () => {
        setSpy = sinon.spy(wrapper.instance(),'createPost');
        wrapper.instance().createPost();
        expect(setSpy.callCount).toEqual(1);
    });
    it('triggers AddPostOrCommentModal correctly', () => {
        setSpy = sinon.spy(wrapper.instance(),'triggerAddPostOrCommentModal');
        wrapper.instance().triggerAddPostOrCommentModal();
        expect(setSpy.callCount).toEqual(1);
    });
});