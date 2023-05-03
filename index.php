<?php
include('storage.php');

if (isset($_GET['item']) && isset($_GET['category'])) {
    $placeToUpdate = $listsStorage->findOne(["place" => $_GET['category']]);
    $placeToUpdate['Items'][] = $_GET['item'];
    $listsStorage->update($placeToUpdate['id'],$placeToUpdate);

    $resp = ["data" => $placeToUpdate['Items']];
    echo json_encode($resp);
    exit();
}

if(isset($_GET['itemName']) && isset($_GET['id'])) {
    $placeToUpdate = $listsStorage->findById($_GET['id']);
    $ind = array_search($_GET['itemName'],$placeToUpdate['Items']);
    unset($placeToUpdate['Items'][$ind]);
    $listsStorage->update($_GET['id'],$placeToUpdate);

    $resp = ["data" => $placeToUpdate['Items']];
    echo json_encode($resp);
    exit();
}

if (isset($_GET['id'])) {
    $newItems = $listsStorage->findById($_GET['id'])['Items'];
    $resp = ["data" => $newItems];
    echo json_encode($resp);
    exit();
}

function getIPAddress()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

$visitorsAddress = getIPAddress();
var_dump(getIPAddress());

if ($visitorsAddress != "46.139.111.189" && $visitorsAddress != "37.76.10.168" && $visitorsAddress != "37.76.7.205" && $visitorsAddress != "37.76.13.139"  && $visitorsAddress != "::1") {
    exit();
}

$places = $listsStorage->findAll([]);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css">
    </link>
    <title>Document</title>
</head>

<body>
    <div class="actions">
        <button id="newItemBtn">Új termék hozzáadása</button>
    </div>

    <div class="main">
        <div class="intro">
            <h1 class="title1">Bevásárlólista</h1>
        </div>

        <div class="mainContent">

            <div class="listsOfTypes">
                <?php $i = -1;
                foreach ($places as $place) : $i++; ?>
                    <div class="listType<?= count($place['Items']) > 0 ? ' hasItemInit' : ''?>" id="<?= $i ?>">
                        <img src="./imgs/<?= $place["img"] ?>">
                        <div><?= $place["place"] ?></div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="activeListItems">
                <h2 id="activeListTitle"></h2>
                <ul id="activeItemsList"></ul>
            </div>

            <div id="newItem" hidden>
                <label>Termék leírása: </label>
                <input type="text" id="itemInput">
                <br>
                <label>Kategória:</label>
                <select id="itemCategory">
                    <?php foreach ($places as $place) : ?>
                        <option>
                            <?= $place['place']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>

                <br>
                <button id="addItemBtn">Hozzáadása</button>
            </div>

        </div>
    </div>

    <script src="index.js"></script>
</body>

</html>