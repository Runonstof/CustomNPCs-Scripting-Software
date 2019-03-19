<?php

function array_take($array, $start, $end) { $r = []; for($i = $start; $i < $end; $i++) { $r[] = $array[$i]; } return $r; }

function array_pushadd(&$array, $items) {
	foreach($items as $item) {
		$array[] = $item;
	}
}