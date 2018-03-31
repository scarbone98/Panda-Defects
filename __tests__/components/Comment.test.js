import Post from '../../src/components/Post';
import React from 'react';
import {expect} from 'chai';
import { shallow, mount, render } from 'enzyme';
import sinon from "sinon";
describe('comment component tests', () => {
    let comment = {
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
    const commentComponent = shallow(<Post data={comment} />);
    let onButtonClick = sinon.spy(commentComponent.instance(),'sharePost');
    it('checks if OP is rendered correctly', () => {
        expect(
            shallow(
                <Post data={comment} />
            ).length
        ).to.equal(1);
    });
    it('sharing post correctly gets triggered when button is clicked', () => {
        commentComponent.find('#sharePost').simulate('click');
        expect(
            onButtonClick
        ).to.have.property('callCount',1);
    });
    it('reporting post correctly gets triggered when label is clicked', () => {
        onButtonClick = sinon.spy(commentComponent.instance(), 'reportPost');
        commentComponent.find('#reportPost').simulate('click');
        expect(
            onButtonClick
        ).to.have.property('callCount',1);
    });
    it('reporting post correctly gets triggered when label is clicked', () => {
        onButtonClick = sinon.spy(commentComponent.instance(), 'renderLoading');
        commentComponent.instance().renderLoading();
        expect(
            onButtonClick
        ).to.have.property('callCount',1);
    });
});