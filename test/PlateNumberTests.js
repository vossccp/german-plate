'use strict';

const assert = require('assert');

const PlateNumber = require('../lib');

suite('PlateNumber', () => {
  suite('parse', () => {
    const positive = [
      { expected: 'HH-CP 1202', actual: 'HH-CP 1202' },
      { expected: 'HH-CP 1202', actual: 'HH-CP1202' },
      { expected: 'HH-CP 1202', actual: 'hh-cp1202' },
      { expected: 'HH-CP 1202', actual: 'HH CP1202' },
      { expected: 'HH-CP 1202', actual: 'HH CP 1202' },
      { expected: 'HH-CP 1202', actual: 'HH.CP 1202' },
      { expected: 'HH-CP 1202', actual: 'HH.CP1202' },
      { expected: 'BA-E 1557', actual: 'BA E  1557' },
      { expected: 'D-IG 70', actual: 'D -IG 0070' },
      { expected: 'GÜ-E 600', actual: 'GUE-E 0600' },
      { expected: 'E-DS 5432', actual: 'E  -DS5432' },
      { expected: 'ST-CB 145', actual: 'ST -CB 145' },
      { expected: 'HH-CP 1202E', actual: 'HH-CP 1202E' },
      { expected: 'HH-CP 1202E', actual: 'HH-CP1202E' },
      { expected: 'HH-CP 1202E', actual: 'hh-cp1202E' },
      { expected: 'HH-CP 1202E', actual: 'HH CP1202E' },
      { expected: 'HH-CP 1202E', actual: 'HH CP 1202E' },
      { expected: 'HH-CP 1202E', actual: 'HH.CP 1202E' },
      { expected: 'HH-CP 1202E', actual: 'HH.CP1202E' },
      { expected: 'BA-E 1557E', actual: 'BA E  1557E' },
      { expected: 'D-IG 70E', actual: 'D -IG 0070E' },
      { expected: 'GÜ-E 600E', actual: 'GUE-E 0600E' },
      { expected: 'E-DS 5432E', actual: 'E  -DS5432E' },
      { expected: 'ST-CB 145E', actual: 'ST -CB 145E' }
    ];

    positive.forEach(testCase => {
      test(`returns '${testCase.expected}' when provided '${
        testCase.actual
      }'`, () => {
        const result = PlateNumber.parse(testCase.actual);

        assert.equal(result, testCase.expected);
      });
    });

    const negative = [
      'D H-X 213',
      'F-BZ 1234567',
      'XX XXXX KU 101',
      'FUE 101',
      'FUE KU'
    ];

    negative.forEach(testCase => {
      test(`throws an error when parsing '${testCase}'`, () => {
        assert.throws(() => {
          PlateNumber.parse(testCase);
        });
      });
    });

    const validButNoRegistrationCommunity = [ 'XX KU 101' ];

    validButNoRegistrationCommunity.forEach(testCase => {
      test(`accepts unknow registration communities '${testCase}'`, () => {
        const result = PlateNumber.parse(testCase);

        assert.equal('XX', result.registrationCommunity.id);
      });
    });

    test('null string return undefined plate number', () => {
      const result = PlateNumber.parse(null);

      assert.equal(undefined, result);
    });

    test('empty string throws an error', () => {
      assert.throws(() => {
        PlateNumber.parse('');
      });
    });
  });
});
