'use strict';

const Intercom = require('intercom.io');
const utils = require('../../lib/utils');
const Maybe = utils.Maybe;
const mapKeys = utils.mapKeys;
const intercomCreatedAt = utils.intercomCreatedAt;

module.exports = (config) => {
	let userInfo;
	const intercomTracker = {};
	const intercom = new Intercom(config.appId, config.apiKey);

	const userKeys = {
		userId: 'user_id',
		email: 'email',
		name: 'name'
	};

	intercomTracker.createUser = (userData) => {
		userInfo = mapKeys(userKeys, userData);
		return intercom.createUser(userInfo);
	};

	intercomTracker.createEvent = (eventName, eventData) => {
		let userData = userInfo;
		eventData = eventData || {};

		return intercom.createEvent(
			Object.assign({}, userData, {
				email: config.email,
				name: config.name,
				user_hash: config.userHash,
				user_id: config.userId,
				event_name: eventName,
				created_at: intercomCreatedAt(),
				metadata: eventData.metadata
			})
		);
	};

	intercomTracker.IntercomIO = intercom;

	return intercomTracker;
};
