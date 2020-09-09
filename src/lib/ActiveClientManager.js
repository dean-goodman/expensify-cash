import _ from 'underscore';
import Guid from './Guid';
import Ion from './Ion';
import IONKEYS from '../IONKEYS';

const clientID = Guid();

/**
 * Add our client ID to the list of active IDs
 *
 * @returns {Promise}
 */
const init = () => Ion.merge(IONKEYS.ACTIVE_CLIENTS, {clientID});

/**
 * Remove this client ID from the array of active client IDs when this client is exited
 *
 * @returns {Promise}
 */
function removeClient() {
    return Ion.get(IONKEYS.ACTIVE_CLIENTS)
        .then(activeClientIDs => _.omit(activeClientIDs, clientID))
        .then(newActiveClientIDs => Ion.set(IONKEYS.ACTIVE_CLIENTS, newActiveClientIDs));
}

/**
 * Checks if the current client is the leader (the first one in the list of active clients)
 *
 * @returns {Promise}
 */
function isClientTheLeader() {
    // At the moment activeClients only has 1 value i.e., the latest clientID so let's compare if
    // the latest matches the current browsers clientID.
    return Ion.get(IONKEYS.ACTIVE_CLIENTS)
        .then(activeClients => activeClients.clientID === clientID);
}

export {
    init,
    removeClient,
    isClientTheLeader
};
