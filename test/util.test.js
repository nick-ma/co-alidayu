var config = require('./config');
var API = require('../');
var util = require('../lib/util');
var expect = require('expect.js');

describe('util', function () {
    describe('format_now', function () {
        it('should ok', function* () {
            var dates = [
                util.format_now(new Date()),
                '2015-01-01 00:00:00',
                '2015-01-01 23:59:59',
                '2015-12-01 00:00:00',
                '2015-12-31 23:59:59',
                '2015-09-09 09:09:09',
            ];
            for (var i = 0; i < dates.length; i++) {
                var ret = util.format_now(new Date(dates[i]));

                expect(ret).to.eql(dates[i]);
            };
        });

    });
});
