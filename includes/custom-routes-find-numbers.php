<?php

/**
 * Register all CUSTON API FOR FIND NUMBER
 */

// get the top  15 results 

add_action('rest_api_init', function () {
  register_rest_route('better-grammar/v1', '/find_number_top_15/(?P<level>[a-zA-Z]+)', array(
    'methods' => 'GET',
    'callback' => 'get_find_number_top_15',
    'permission_callback' => '__return_true',  

  ));
});

function get_find_number_top_15($request) {
  $level = $request->get_param('level');
  
  // Check if the level is valid
  $valid_levels = ['easy', 'intermediate', 'hard']; 
  if (!in_array($level, $valid_levels)) {
    return new WP_Error('invalid_level', 'The level parameter is invalid.', array('status' => 400));
  }

  global $wpdb;
  $FindNumberResultsName = $wpdb->prefix . 'bg_find_number_results';
  
  $FindNumberResults = $wpdb->get_results(
    $wpdb->prepare("SELECT username, game_results, result_date
    FROM $FindNumberResultsName
    WHERE game_level = %s
    ORDER BY game_results DESC
    LIMIT 15", $level)
  );

  return $FindNumberResults;
}

// GET TOP 5 RESULTS

add_action('rest_api_init', function () {
  register_rest_route('better-grammar/v1', '/find_number_top_5/(?P<level>[a-zA-Z]+)', array(
    'methods' => 'GET',
    'callback' => 'get_user_top_5_number_results',
    'permission_callback' => '__return_true',  
  ));
});

function get_user_top_5_number_results($request) {
  $level = $request->get_param('level');

// Check if the level is valid
$valid_levels = ['easy', 'intermediate', 'hard']; 
if (!in_array($level, $valid_levels)) {
  return new WP_Error('invalid_level', 'The level parameter is invalid.', array('status' => 400));
}
  // Get current user ID
  $user_id = get_current_user_id();

  global $wpdb;
  $table_name = $wpdb->prefix . 'bg_find_number_results';

  $query = $wpdb->prepare(
    "SELECT game_results, result_date, game_level FROM $table_name WHERE user_id = %d AND game_level = %s ORDER BY game_results DESC LIMIT 5",
    $user_id, $level
  );
  
  $results = $wpdb->get_results($query);

  if (!empty($results)) {
    return new WP_REST_Response($results, 200);
  } else {
    return new WP_Error('no_scores', 'No scores found for this user', array('status' => 404));
    
  }
}

// SAVE INDIVIDUAL RESULTS
add_action('rest_api_init', function () {
  register_rest_route('better-grammar/v1', '/add_find_number_result', array(
    'methods' => 'POST',
    'callback' => 'add_find_number_result',
    'permission_callback' => '__return_true',  
  ));
});

function add_find_number_result($request) {
  $user_id = get_current_user_id(); // This assumes the user is logged in
  $username = wp_get_current_user()->user_login;
  $game_results = $request->get_param('game_results');
  $game_level = $request->get_param('game_level');
  $resultDate = current_time('mysql');  

  // Global $wpdb for database operations
  global $wpdb;

  $FindNumberResultsName = $wpdb->prefix . 'bg_find_number_results';

  $inserted = $wpdb->insert(
    $FindNumberResultsName,
    array(
      'user_id' => $user_id,
      'username' => $username,
      'game_results' => $game_results,
      'result_date' => $resultDate,
      'game_level' => $game_level
    ),
    array(
      '%d',
      '%s',
      '%d',
      '%s',
      '%s'
    )
  );

  if ($inserted) {
    return new WP_REST_Response('Result added successfully', 200);
  } else {
    return new WP_Error('db_error', 'Could not insert result into database', array('status' => 500));
  }
}



?>