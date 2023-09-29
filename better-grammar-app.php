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
include_once(plugin_dir_path(__FILE__) . 'includes/custom-routes.php');

register_activation_hook(__FILE__, 'create_find_number_table');

function check_for_shortcode($posts) {
	if (empty($posts)) {
			return $posts;
	}

	$found = false;

	foreach ($posts as $post) {
			if (has_shortcode($post->post_content, 'better_grammar')) {
					$found = true;
					break;
			}
	}

	if ($found) {
			enqueue_bettergrammarapp_scripts();
	}

	return $posts;
}

add_filter('the_posts', 'check_for_shortcode');



function enqueue_bettergrammarapp_scripts() {
	$plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), false);
	$plugin_version = $plugin_data['Version'];

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
// add_action('wp_enqueue_scripts', 'enqueue_bettergrammarapp_scripts', 99);

function register_my_custom_block() {
	register_block_type_from_metadata(
			plugin_dir_path(__FILE__)
	);
}
add_action('init', 'register_my_custom_block');

function better_grammar_shortcode() {
	return '<div id="better-grammar-app" class="better-grammar-app"></div>';
}
add_shortcode('better_grammar', 'better_grammar_shortcode'); 
