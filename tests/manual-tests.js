/*
const quotePrep = require('./src/services/quote-prep');
quotePrep.createB60fp610({
    agentNumber: '0001000',
    policyEffectiveDate: '2020-01-05',
    constructionyear: '2020',
    replacementCost: '1234',
    waitingPeriod: '5',
    lastName1: 'Magid',
    firstName1: 'Aaron',
    lastName2: 'Romo',
    firstName2: 'David',
    propertyAddress: {
        address1: '833 Mendocino Ave',
        address2: 'Apt. 2',
        city: 'Berkeley',
        state: 'CA',
        zipcode: '94707'
    },
    underconstruction: 'N',
    condounitowner: 'Y',
    basementenclosure: 'Y',
    attachedgarage: 'Y',
    tenantoccupied: 'Y',
    primaryresidence: 'Y',
    buildingpurpose: 'H'
});

quotePrep.rateQuote('1234');

const address = require('./src/services/address');
address.validate({
    address1: '833 Mendocino Ave',
    address2: 'Home',
    city: 'Berkeley',
    state: 'CA',
    zipcode: '94707',
    country: 'USA'
});

const nfip = require('./src/controllers/nfip-quote');
nfip.getQuote({
    agentNumber: '0001000',
    policyEffectiveDate: '2020-01-05',
    constructionyear: '2020',
    replacementCost: '1234',
    waitingPeriod: '5',
    lastName1: 'Magid',
    firstName1: 'Aaron',
    lastName2: 'Romo',
    firstName2: 'David',
    propertyAddress: {
        address1: '833 Mendocino Ave',
        address2: 'Apt. 2',
        city: 'Berkeley',
        state: 'CA',
        zipcode: '94707'
    },
    underconstruction: 'N',
    condounitowner: 'Y',
    basementenclosure: 'Y',
    attachedgarage: 'Y',
    tenantoccupied: 'Y',
    primaryresidence: 'Y',
    buildingpurpose: 'H'
});
*/
