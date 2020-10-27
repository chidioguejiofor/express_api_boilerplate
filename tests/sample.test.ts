import { expect } from 'chai';

describe('Setup Test suite', () => { // the tests container
    it('Checking that one is one', () => { // the single test
        expect(1, 'Value should be one').to.equal(1);
    });

});