import { expect } from 'chai';

describe('Setup Test suite', () => { // the tests container
    it('Checking that one is one', () => { // the single test
        expect(1, 'Value should be one').to.equal(1);
    });
    it('Checking that one is 9', () => { // the single test
        expect(1, 'Value should be 9').to.equal(9);
    });

});