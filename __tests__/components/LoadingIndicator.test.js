import LoadingIndicator from '../../src/components/LoadingIndicator';
import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';
describe('loading Indicator component', () => {
    it('loading Indicator renders properly', () => {
        expect(
            shallow(
                <LoadingIndicator color={'red'} type={'something'}/>
            ).length
        ).toEqual(1);
    });
});