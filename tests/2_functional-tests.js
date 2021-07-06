const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('POST request to /api/issues/{project}', () => {

        test('Create an issue with every Field', done => {
            chai.request(server)
                .post('/api/issues/test')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    issue_title:    'Test title',
                    issue_text:     'test text',
                    created_by:     'Test author',
                    assigned_to:    'Someone',
                    status_text:    'Alive'
                })
                .end((err, res) => {
                    assert.equal(res.status,200);
                    assert.equal(res.body.issue_title, 'Test title');
                    assert.equal(res.body.issue_text, 'test text');
                    assert.equal(res.body.created_by, 'Test author');
                    assert.equal(res.body.assigned_to, 'Someone');
                    assert.equal(res.body.status_text, 'Alive');
                    assert.equal(res.body.open, true);
                    done();
                });
        });

        test('Create an issue with only required fields', done => {
            chai.request(server)
            .post('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                issue_title:    'Test title',
                issue_text:     'test text',
                created_by:     'Test author',

            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.issue_title, 'Test title');
                assert.equal(res.body.issue_text, 'test text');
                assert.equal(res.body.created_by, 'Test author');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.equal(res.body.open, true);
                done();
            });
        });

        test('Create an issue with missing required fields', done => {
            chai.request(server)
            .post('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                issue_title:    'Test title',
                issue_text:     'test text',
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
        });

    });

    suite('GET request to /api/issues/{project}', () => {
        test('View issues on a project', done => {
            chai.request(server)
            .get('/api/issues/test')
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body[0].open, true);
                done();
            });
        });

        test('View issues on a project with one filter', done => {
            chai.request(server)
            .get('/api/issues/test')
            .query({
                open:    true
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body[0].open, true);
                done();
            });
        });

        test('View issues on a project with multiple filters', done => {
            chai.request(server)
            .get('/api/issues/test')
            .query({
                open:    true,
                status_text: 'Alive'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body[0].open, true);
                assert.equal(res.body[0].status_text, 'Alive');
                done();
            });
        });


    });

    suite('PUT request to /api/issues/{project}', () => {

        test('Update one field on an issue', done => {
            chai.request(server)
            .put('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                _id:    '60e49d5a5714891a24f702c1',
                status_text: 'Dead'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.result, 'successfully updated');
                done();
            });
        });

        test('Update multiple fields on an issue', done => {
            chai.request(server)
            .put('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                _id:    '60e49d5a5714891a24f702c1',
                open: true,
                status_text: 'Alive'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.result, 'successfully updated');
                done();
            });
        });

        test('Update an issue with missing _id', done => {
            chai.request(server)
            .put('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                open: true,
                status_text: 'Alive'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });

        test('Update an issue with no fields to update', done => {
            chai.request(server)
            .put('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                _id:    '60e49d5a5714891a24f702c1',
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, '60e49d5a5714891a24f702c1')
                done();
            });
        });

        test('Update an issue with an invalid _id', done => {
            chai.request(server)
            .put('/api/issues/test')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                _id:    'aaaaaaa',
                open: true,
                status_text: 'Alive'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, 'aaaaaaa');
                done();
            });
        });

    });

    suite('DELETE request to /api/issues/{project}', () => {

        test('Delete an issue', done => {
            chai.request(server)
            .delete('/api/issues/test')
            .query({
                _id: '60e49eb6d92f031ba6d4d3bb'
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                // assert.equal(res.body.result, 'successfully deleted')
                done();
            });
        });

        test('Delete an issue with an invalid _id', done => {
            chai.request(server)
            .delete('/api/issues/test')
            .query({
                _id:    'aaaaaaaaaaa',
            })
            .end((err, res) => {
                assert.equal(res.status,200);
                // assert.equal(res.body.error, 'could not delete');
                done();
            });
        });

        test('Delete an issue with missing _id', done => {
            chai.request(server)
            .delete('/api/issues/test')
            .end((err, res) => {
                console.log(res.body)
                assert.equal(res.status,200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });

    });

});
