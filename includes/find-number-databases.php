<?php

function create_find_number_table() {
  global $wpdb;

  $table_name = $wpdb->prefix . 'bg_find_number_results';  
  $charset_collate = $wpdb->get_charset_collate();

  $sql = "CREATE TABLE $table_name (
      id int(11) NOT NULL AUTO_INCREMENT,
      user_id mediumint(9) NOT NULL,
      username tinytext NOT NULL,
      game_level tinytext NOT NULL,
      game_results smallint(5) NOT NULL,
      result_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
      PRIMARY KEY  (id)
  ) $charset_collate;";

  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  dbDelta($sql);
}



?>