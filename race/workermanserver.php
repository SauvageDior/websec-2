<?php

require_once __DIR__ . '/workerman/Protocols/Websocket.php';
require_once __DIR__ . '/workerman/Connection/ConnectionInterface.php';
require_once __DIR__ . '/workerman/Connection/TcpConnection.php';
require_once __DIR__ . '/workerman/Events/EventInterface.php';
require_once __DIR__ . '/workerman/Events/Select.php';
require_once __DIR__ . '/workerman/Worker.php';
require_once __DIR__ . '/workerman/Timer.php';

require_once __DIR__ . '/php/player.php';

use Workerman\Worker;

$players = [];
$player_number = 1;
$star = randomizeStar();

$ws_worker = new Worker("websocket://127.0.0.1:22222");
$ws_worker->count = 10;

function randomizeStar() : array
{
    return [rand(0, 750), rand(0, 550)];
}

function dist2($x1, $y1, $x2, $y2) : float
{
    return ($x1 - $x2) * ($x1 - $x2) + ($y1 - $y2) * ($y1 - $y2);
}

$ws_worker->onConnect = function($connection) use(&$players, &$player_number)
{
    $player = new Player($player_number, $connection);
    $player_number = $player_number + 1;
    $uid = $player->getUID();
    $players[$uid] = $player;
    $ret = [];
    $ret['request_type'] = 'init';
    $ret['data'] = [];
    $ret['data']['number'] = $player_number - 1;
    $ret['data']['uid'] = $uid;
    $connection->send(json_encode($ret));
    echo "New connection: $uid\n";
};

$ws_worker->onMessage = function($connection, $data) use(&$players, &$star)
{
    $ret = [];
    $data = json_decode($data, true);
    if(isset($data['uid']))
        $uid = $data['uid'];
    else
        $uid = null;
    if(!isset($players[$uid])) return;
    $players[$uid]->setData($data['x'], $data['y'], $data['angle'], $data['name']);
    if(dist2($data['x'], $data['y'], $star[0], $star[1]) < 1000) {
        $star = randomizeStar();
    }
    $ret['request_type'] = 'state';
    $ret['data'] = [];
    $ret['star'] = $star;
    foreach ($players as $player) {
        $ret['data'][] = $player->getData();
    }
    $connection->send(json_encode($ret));
};

$ws_worker->onClose = function($connection) use(&$players)
{
    echo "Connection closed\n";
    foreach ($players as $key => $player) {
        if($player->hasConnection($connection)) {
            print_r("unset\n");
            unset($players[$key]);
        }
    }
};

Worker::runAll();
