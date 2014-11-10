<?php
$files = $_FILES['files'];
// Save the uploaded files
for ($index = 0; $index < count($files['name']); $index++) {
    $file = $files['tmp_name'][$index];
    if (is_uploaded_file($file)) {
        move_uploaded_file($file, './' . $files['name'][$index]);
    }
}
?>
