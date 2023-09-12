<?php 
/*
Plugin Name: Better Grammar App
Description: Grammar Exercises
Version: 1.0.2
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

function enqueue_bettergrammarapp_scripts() {
	// Get the plugin data to fetch the version number
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), false);
	$plugin_version = $plugin_data['Version'];

	wp_enqueue_script('bettergrammar-main-scripts', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-element', 'wp-blocks', 'wp-editor'), $plugin_version, true);
	wp_enqueue_style('bettergrammar-main-styles', plugin_dir_url(__FILE__) . 'build/index.css', array(), $plugin_version);

	// Localize the script with new data
	$script_data_array = array(
			'root' => esc_url_raw(rest_url()),
			'nonce' => wp_create_nonce('wp_rest')
	);
	wp_localize_script('bettergrammar-main-scripts', 'wpApiSettings', $script_data_array);

// localize if user is logged in
wp_localize_script('bettergrammar-main-scripts', 'user_status', array(
	'logged_in' => is_user_logged_in()));
}
add_action('wp_enqueue_scripts', 'enqueue_bettergrammarapp_scripts');


/* ALL SHORTCODE HERE */

function better_grammar_shortcode() {
	return '<div id="better-grammar-app"></div>';}

add_shortcode('better_grammar', 'better_grammar_shortcode'); 