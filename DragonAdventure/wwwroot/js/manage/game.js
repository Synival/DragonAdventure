"use strict"

function gameCreate() {
    // TODO: options!
    api('/Game/Create', 'POST', null, function() {
        window.location.reload();
    });
}

function gamePlay(gameId) {
    window.location = '/Game/Play/' + gameId;
}

function gameDelete(gameId) {
    api('/Game/Delete/' + gameId, 'DELETE', null, function() {
        window.location.reload();
    });
}
