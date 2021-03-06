export { };

require('dotenv').config();
import express from '../server'
import chai from 'chai';
import chaiHttp from 'chai-http';
import env from '../environment';
import log from '../logger';
const { expect } = chai;
chai.use(chaiHttp);

describe('/comments', () => {

	var server = express.listen(8002);
	var commentId = '';

	after(function () {
		server.close();
	});

	it('should get any public issue\'s comments', (done) => {
		let user = 'commen-tk';
		let repo = 'tfm-testing';
		let issue = 2;
		chai.request(server)
			.get(`/issues/${user}/${repo}/${issue}/comments?pagesize=10`)
			.set('authorization', `token ${env.github_testing_token}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('repository');
				expect(res.body.repository).to.have.property('createdAt');
				expect(res.body.repository).to.have.property('issue');
				expect(res.body.repository.issue).to.have.property('comments');
				expect(res.body.repository.issue.comments).to.have.property('pageInfo');
				expect(res.body.repository.issue.comments).to.have.property('totalCount');
				expect(res.body.repository.issue.comments).to.have.property('nodes');
				done();
			});
	});

	it('should post a comment in an issue', (done) => {
		let user = 'commen-tk';
		let repo = 'tfm-testing';
		let issue = 2;
		chai.request(server)
			.post(`/issues/${user}/${repo}/${issue}/comments`)
			.set('authorization', `token ${env.github_testing_token}`)
			.set('content-type', 'application/json')
			.send({ body: 'Comment generated during testing' })
			.end((err, res) => {
				commentId = res.body.addComment.commentEdge.node.id;
				expect(res).to.have.status(200);
				done();
			});
	});

	it('should delete a comment in an issue', (done) => {
		chai.request(server)
			.delete(`/comments/${commentId}`)
			.set('authorization', `token ${env.github_testing_token}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
	});

	it('should post a comment in an issue using cached issue id', (done) => {
		let user = 'commen-tk';
		let repo = 'tfm-testing';
		let issue = 2;
		chai.request(server)
			.post(`/issues/${user}/${repo}/${issue}/comments`)
			.set('authorization', `token ${env.github_testing_token}`)
			.set('content-type', 'application/json')
			.send({ body: 'Comment generated during testing' })
			.end((err, res) => {
				commentId = res.body.addComment.commentEdge.node.id;
				expect(res).to.have.status(200);
				chai.request(server)
					.delete(`/comments/${commentId}`)
					.set('authorization', `token ${env.github_testing_token}`)
					.end((err, res) => {
						expect(res).to.have.status(200);
						done();
					});
			});
	});
});