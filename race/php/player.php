<?php


class Player
{
    private string $uid;
    private int $number;
    private string $name;
    private float $x;
    private float $y;
    private float $angle;
    private Workerman\Connection\TcpConnection $connection;

    public function getUID() : string
    {
        return $this->uid;
    }

    public function getNumber() : string
    {
        return $this->number;
    }

    public function hasConnection(Workerman\Connection\TcpConnection $connection) : bool
    {
        return $this->connection === $connection;
    }

    function __construct(int $number, Workerman\Connection\TcpConnection $connection)
    {
        $this->uid = $this->randString(10);
        $this->number = $number;
        $this->name = "player";
        $this->x = 0;
        $this->y = 0;
        $this->angle = 0;
        $this->connection = $connection;
    }

    private static function randString($length) : string
    {
        $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        $str = '';
        $count = strlen($charset);
        while ($length--) {
            $str .= $charset[mt_rand(0, $count-1)];
        }
        return $str;
    }

    public function getData() : array
    {
        $data = [];
        $data['number'] = $this->number;
        $data['x'] = $this->x;
        $data['y'] = $this->y;
        $data['angle'] = $this->angle;
        $data['name'] = $this->name;
        return $data;
    }

    public function setData($x, $y, $angle, $name)
    {
        $this->x = $x;
        $this->y = $y;
        $this->angle = $angle;
        $this->name = $name;
    }
}