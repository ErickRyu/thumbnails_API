const assert = require('assert');
const should = require('should');
const app = require('./index');
const request = require('supertest');

describe('GET /thumbnails/?url=https://github.com', () => {
	it('should return 200 status code', () => {
		request(app)
			.get('/thumbanils/?url=https://google.com')
			.expect(200)
			.end((err, res) => {
				if(err) throw err;
				done();
			})
	});
});
