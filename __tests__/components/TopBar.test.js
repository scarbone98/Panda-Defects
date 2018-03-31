import TopBar from '../../src/components/TopBar';
import React from 'react';
import {expect} from 'chai';
import { shallow } from 'enzyme';
describe('TopBar component tests', () => {
    it('make sure TopBar includes all 4 links to the pages', () => {
        expect(
            shallow(
                <TopBar/>
            ).find('.Top-Bar-Element').length
        ).to.equal(4);
    });
});