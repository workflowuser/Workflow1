<?php
$listOfAllItems = array(
    null => array(),
    "servers" => array(
        array(
            "ID" => "http://wfserver1/",
            "label" => "http://wfserver1/"
        ), 
        array(
            "ID" => "http://wfserver2/",
            "label" => "http://wfserver2/"
        ), 
        array(
            "ID" => "http://loremipserver/",
            "label" => "http://loremipserver/"
        ), 
        array(
            "ID" => "XXX",
            "label" => "XXX"
        )
    ),
    "sites" => array(
        array(
            "ID" => "WFSiteA",
            "label" => "WFSiteA"
        ), 
        array(
            "ID" => "WFSiteB",
            "label" => "WFSiteB"
        ), 
        array(
            "ID" => "Formex",
            "label" => "Formex"
        ), 
        array(
            "ID" => "Blorvex",
            "label" => "Blorvex"
        ), 
        array(
            "ID" => "Snorlax",
            "label" => "Snorlax"
        ), 
        array(
            "ID" => "Ipsum Listum",
            "label" => "Ipsum Listum"
        ), 
        array(
            "ID" => "Dolor Site",
            "label" => "Dolor Site"
        ), 
        array(
            "ID" => "Clipsum",
            "label" => "Clipsum"
        ), 
        array(
            "ID" => "XXX",
            "label" => "XXX"
        )
    ),
    "lists" => array(
        array(
            "ID" => "Appointment Calendar",
            "label" => "Appointment Calendar"
        ), 
        array(
            "ID" => "Birthdays Calendar",
            "label" => "Birthdays Calendar"
        ), 
        array(
            "ID" => "Client Contacts",
            "label" => "Client Contacts"
        ), 
        array(
            "ID" => "Resources",
            "label" => "Resources"
        ), 
        array(
            "ID" => "Application Forms",
            "label" => "Application Forms"
        ), 
        array(
            "ID" => "Team Calendar",
            "label" => "Team Calendar"
        ), 
        array(
            "ID" => "Contacts",
            "label" => "Contacts"
        ), 
        array(
            "ID" => "XXX",
            "label" => "XXX"
        )
    )
);

$targetItem = null;



if($_GET['targetitem'] !== null) {
    $targetItem = $_GET['targetitem'];
}



echo json_encode($listOfAllItems[$targetItem]);
