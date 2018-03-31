import Favorites from '../../src/views/Favorites';
import React from 'react';
import {expect} from 'chai';
import { mount } from 'enzyme';
import sinon from "sinon";
describe('FavoritePosts view shallow tests', () => {
    const wrapper = mount(<Favorites/>);
    it('component FavoritePosts renders without crash', () => {
        expect(wrapper.length
        ).to.equal(1);
    });
    it('comments are loaded into the page', () => {
        let setSpy = sinon.spy(wrapper.instance(),'getFavorites');
        let user = {uid: 'mockUser'};
        wrapper.instance().getFavorites(user);
        expect(setSpy.callCount).to.equal(1);
    });
});