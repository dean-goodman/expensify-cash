import _ from 'underscore';
import Guid from './Guid';
import Ion from './Ion';
import IONKEYS from '../IONKEYS';

const clientID = Guid();

let activeClients;
Ion.connect({
    key: IONKEYS.ACTIVE_CLIENTS,

    callback: val => activeClients = val,
});

/**
 * Add our client ID to the list of active IDs
 */
function init() {
    Ion.merge(IONKEYS.ACTIVE_CLIENTS, {[clientID]: clientID});
}

/**
 * Remove this client ID from the array of active client IDs when this client is exited
 */
function removeClient() {
    Ion.set(IONKEYS.ACTIVE_CLIENTS, _.omit(activeClients, clientID));
}

/**
 * Checks if the current client is the leader (the first one in the list of active clients)
 *
 * @returns {boolean}
 */
function isClientTheLeader() {
    return _.first(_.keys(activeClients)) === clientID;
}

export {
    init,
    removeClient,
    isClientTheLeader
};
