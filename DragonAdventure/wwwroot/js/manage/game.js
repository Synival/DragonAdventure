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

function gameGetAll(callback) {
    var $games = $('#games');
    $games.html("<p>Loading...</p>");

    apiGet('/Game/GetAllWithState',
        function(result) {
            if (result == null || result.length == 0) {
                $games.html('<p>You have no active games.</p>');
            }
            else {
                var html =
                    "<table id='games-table'>" +
                        '<thead><tr>' +
                            '<th>Created on:</th>' +
                            '<th>Last played:</th>' +
                            '<th>Time played:</th>' +
                            '<th>Map:</th>' +
                            '<th># of steps:</th>' +
                            '<th># of frames:</th>' +
                            '<th># of battles:</th>' +
                            '<th></th>' +
                        '</tr></thead>' +
                        '<tbody>';

                for (var i = 0; i < result.length; i++) {
                    var game  = result[i].game;
                    var state = result[i].state;
                    html +=
                        '<tr>' +
                            '<td>' + prettyDate(game.createdOn) + '</td>' +
                            '<td>' + prettyDate(state.timestamp) + '</td>' +
                            '<td>' + state.timePlayed  + '</td>' +
                            '<td>' + state.mapId + ' (' + state.mapX + ', ' + state.mapY + ')</td>' +
                            '<td>' + state.stepCount   + '</td>' +
                            '<td>' + state.frameCount  + '</td>' +
                            '<td>' + state.battleCount + '</td>' +
                            '<td><button onclick="gamePlay(' + game.id + ')">Play!</button></td>' +
                        '</tr>';
                }

                html +=
                        '</tbody>' +
                    '</table>';
                $games.html(html);
            }
        },
        function(result) {
            $games.html("<p class='error'>Loading failed.</p>");
        }
    );
}
