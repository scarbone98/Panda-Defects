import Post from '../../src/components/Post';
import React from 'react';
import {expect} from 'chai';
import { shallow } from 'enzyme';
import sinon from "sinon";
describe('Post component tests', () => {
    let post = {
        icons: [],
        content: 'This is a test',
        user: 'myid',
        commentList: [],
        votes: 10,
        postTime: new Date(),
        key: 'fasdsadasd',
        image: true,
        reportCount: 0,
        reportList: [],
        uniqueComments: 0,
        commentUsers: []
    };
    const postComponent = shallow(<Post data={post} />);
    let onButtonClick = sinon.spy(postComponent.instance(),'sharePost');
    it('post gets correct data from backend ', () => {
        expect(
            postComponent.length
        ).to.equal(1);
    });
    it('sharing post correctly gets triggered when button is clicked', () => {
        postComponent.find('#sharePost').simulate('click');
        expect(
            onButtonClick
        ).to.have.property('callCount',1);
    });
    it('reporting post correctly gets triggered when label is clicked', () => {
        onButtonClick = sinon.spy(postComponent.instance(), 'reportPost');
        postComponent.find('#reportPost').simulate('click');
        expect(
            onButtonClick
        ).to.have.property('callCount',1);
    });
});