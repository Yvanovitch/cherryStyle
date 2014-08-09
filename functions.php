<?php
/**
 * cherrystyle functions and definitions
 *
 * @package cherrystyle
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

if ( ! function_exists( 'cherrystyle_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function cherrystyle_setup() {
	/* Add filters :
	*/
	add_filter( 'use_default_gallery_style', '__return_false' );

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on cherrystyle, use a find and replace
	 * to change 'cherrystyle' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'cherrystyle', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	//add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'cherrystyle' ),
	) );
	
	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside', 'image', 'video', 'quote', 'link'
	) );

	// Setup the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'cherrystyle_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // cherrystyle_setup
add_action( 'after_setup_theme', 'cherrystyle_setup' );
add_filter( 'use_default_gallery_style', '__return_false' );
/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 */
function cherrystyle_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'cherrystyle' ),
		'id'            => 'sidebar-1',
		'description'   => '',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h1 class="widget-title">',
		'after_title'   => '</h1>',
	) );
}
add_action( 'widgets_init', 'cherrystyle_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function cherrystyle_scripts() {
	wp_enqueue_style( 'cherrystyle-style', get_stylesheet_uri() );

	wp_enqueue_script('jquery');

	wp_enqueue_script( 'cherrystyle-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );

	wp_enqueue_script( 'cherrystyle-full-screen-api', get_template_directory_uri() . '/js/full-screen-api.js', array(), '1.0', true );

	wp_enqueue_script( 'cherrystyle-mouseScroll', get_template_directory_uri() . '/js/mouseScroll.js', array(), '1.0', true );

	wp_enqueue_script( 'cherrystyle-gallery', get_template_directory_uri() . '/js/gallery.js', array(), '1.0', true );

	wp_enqueue_script( 'cherrystyle-conveniant', get_template_directory_uri() . '/js/conveniant.js', array(), '1.0', true );

	wp_enqueue_script( 'cherrystyle-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'cherrystyle_scripts' );

/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';


add_filter('post_gallery', 'my_post_gallery', 10, 2);
function my_post_gallery($output, $attr) {
	locate_template( 'template-gallery.php', TRUE, TRUE );
    return " ";
}














function cherry_comment($comment, $args, $depth) {
	$GLOBALS['comment'] = $comment;
	extract($args, EXTR_SKIP);

	if ( 'div' == $args['style'] ) {
		$tag = 'div';
		$add_below = 'comment';
	} else {
		$tag = 'li';
		$add_below = 'div-comment';
	}
?>
	<<?php echo $tag ?> <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ) ?> id="comment-<?php comment_ID() ?>">
	<?php if ( 'div' != $args['style'] ) : ?>
	<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
	<?php endif; ?>

	<?php if ( $args['avatar_size'] != 0 ) echo get_avatar( $comment, $args['avatar_size'] ); ?>

	<div class="comment-content">
		<div class="comment-author vcard">
		
		<?php printf( __( '<cite class="fn">%s</cite> <span class="says">:</span>' ), get_comment_author_link() ); ?>
		</div>
		<?php if ( $comment->comment_approved == '0' ) : ?>
			<em class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.' ); ?></em>
			<br />
		<?php endif; ?>

		<div class="comment-button">
			<?php edit_comment_link('<img class="icon edit-icon" src="'.get_template_directory_uri().'/images/pen_write.png" alt="Éditer"/>' , '  ', '' ); ?>

			<?php comment_reply_link( array_merge( $args, array('reply_text'=>'<img class="icon reply-icon" src="'.get_template_directory_uri().'/images/reply.png" alt="Répondre"/>', 
				'add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
		</div>

		<?php comment_text(); ?>

		<div class="comment-meta commentmetadata"><?php
				/* translators: 1: date, 2: time */
				printf( __('%1$s, %2$s'), get_comment_date(),  get_comment_time('H:i') ); ?>

		</div>
		<div class="spacer"> </div>
	</div>
	
	<?php if ( 'div' != $args['style'] ) : ?>
	</div>
	<?php endif; ?>
<?php
}



function hide_long_comment ($content) {
	$max_letters = 35;

	if(strlen($content) > $max_letters) {
		$words = explode(' ', $content);
		$counter = strlen($words[0]);
		$i = 0;
		while($counter < $max_letters) {
			$i++;
			$counter = $counter + strlen($words[$i]) + 1;			
		}
		$i++;
		if($i < count($words)) {
			$content = implode(' ', array_slice($words, 0, $i)) . '<a href="#" class="comment-more-button">...</a>';
			//On ajoute la suite dans un span qui sera caché dans le css
			$content .= '<span class="comment-more-content"> ' . implode(' ', array_slice($words, $i + 1)) . '</span>';
		}
		else {
			$content = implode(' ', array_slice($words, 0));
		}
	}
	return $content;
}