<?php 
/*
Plugin Name: Better Grammar App
Description: Grammar Exercises
Version: 1.0.5
Author: Quentin Ober
Author URI: https://www.linkedin.com/in/quentinober/
Text Domain: bettergrammarapp
Domain Path: /languages
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'BETTER_GRAMMAR_APP', '1.0.0' );

// DATABASES ACTIVATION
include_once(plugin_dir_path(__FILE__) . 'includes/find-number-databases.php');
include_once(plugin_dir_path(__FILE__) . 'includes/custom-routes-find-numbers.php');
include_once(plugin_dir_path(__FILE__) . 'includes/find-preposition-databases.php');
include_once(plugin_dir_path(__FILE__) . 'includes/custom-routes-find-prepositions.php');

register_activation_hook(__FILE__, 'create_find_number_table');
register_activation_hook(__FILE__, 'create_find_preposition_table');


function enqueue_bettergrammarapp_scripts() {
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), false);
	$plugin_version = $plugin_data['Version'];

	// enqueue only if page games
	global $wp;
	$current_url = home_url(add_query_arg(array(), $wp->request));

	if (strpos($current_url, 'games') === false) {
		return;
}
	wp_enqueue_script('bettergrammar-main-scripts', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-element'), $plugin_version, true);
	wp_enqueue_style('bettergrammar-main-styles', plugin_dir_url(__FILE__) . 'build/index.css', array(), $plugin_version);


	wp_localize_script('bettergrammar-main-scripts', 'wpApiSettings', array(
		'root' => esc_url_raw(rest_url()),
		'nonce' => wp_create_nonce('wp_rest')));

	wp_localize_script('bettergrammar-main-scripts', 'user', array(
		'logged_in' => is_user_logged_in(),
		'login_url' => wp_login_url()
	));
}
add_action('wp_enqueue_scripts', 'enqueue_bettergrammarapp_scripts', 99);

function better_grammar_shortcode() {
	return '<div id="better-grammar-app" class="better-grammar-app"></div>';
}
add_shortcode('better_grammar', 'better_grammar_shortcode'); 
