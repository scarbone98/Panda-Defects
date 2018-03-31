import HistoryEntry from '../../src/components/HistoryEntry';
import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';
describe('historyEntry component tests', () => {
    let mockPost = {
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
    it('component HistoryEntry loads props passed by backend', () => {
        expect(
            shallow(
                <HistoryEntry data={mockPost}/>
            ).length
        ).toEqual(1);
    });
});