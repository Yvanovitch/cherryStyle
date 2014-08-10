<?php
/**
 * The template for displaying comments.
 *
 * The area of the page that contains both current comments
 * and the comment form.
 *
 * @package cherrystyle
 */

/* id & class :
comment div :class : 	comments-box, 	id : comments-75
respond div :class : 	respond-block, 	id : respond-block-75
form :		 class : 	comment-form, 	id : commentform-inactive	//To be compatible with ajaxify
*/
/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-box">

	<?php if ( have_comments() ) : ?>

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
		<nav id="comment-nav-above" class="comment-navigation" role="navigation">
			<h1 class="screen-reader-text"><?php _e( 'Comment navigation', 'cherrystyle' ); ?></h1>
			<div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'cherrystyle' ) ); ?></div>
			<div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'cherrystyle' ) ); ?></div>
		</nav><!-- #comment-nav-above -->
		<?php endif; // check for comment navigation ?>

		<ol class="comment-list">
			<?php
				add_filter('comment_text', 'hide_long_comment');

				wp_list_comments( array(
					'style'      => 'ol',
					'short_ping' => true,
					'type' => 'comment',
					'callback' => 'cherry_comment'
				),  get_comments('post_id='.get_the_ID()) );
			?>
		</ol><!-- .comment-list -->

		<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
		<nav id="comment-nav-below" class="comment-navigation" role="navigation">
			<h1 class="screen-reader-text"><?php _e( 'Comment navigation', 'cherrystyle' ); ?></h1>
			<div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'cherrystyle' ) ); ?></div>
			<div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'cherrystyle' ) ); ?></div>
		</nav><!-- #comment-nav-below -->
		<?php endif; // check for comment navigation ?>

	<?php endif; // have_comments() ?>

	<?php
		// If comments are closed and there are comments, let's leave a little note, shall we?
		if ( ! comments_open() && '0' != get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
	?>
		<p class="no-comments"><?php _e( 'Comments are closed.', 'cherrystyle' ); ?></p>
	<?php endif; ?>




<?php if ( comments_open() ) : ?>
	<div id="respond-block" class="repond-block">
		<?php //Si l'utilisateur est logué, on place son image avant le comment_field
		$avatar = '';
		$isLogged = '';
		$current_user = wp_get_current_user();
		if ( is_user_logged_in() ) {
			if( get_avatar( $current_user->ID) != null ) {
				$avatar = get_avatar( $current_user->ID, 32);
				$isLogged = 'form-logged';
			}
			else {
				$avatar = '';
			}
		}



		$args = array(
			//'id_form' => 'commentform',	

			'comment_field' =>  '<p class="comment-form-comment '.$isLogged.'"><label for="comment">' . _x( 'Comment', 'noun' ) .
		    '</label><input id="comment" name="comment" type="text" required placeHolder="Écrire un commentaire..." size="30"' . $aria_req . ' /></p>',
		    
		    'logged_in_as' => '<div class="comment-author vcard">'.$avatar.'</div>',
		    
		    'comment_notes_before' => ' ',
		    
		    'label_submit' => 'Envoyer',
		    
		    'fields' => array(

			    'author' =>
			      '<div class="comment-form-information">
			      <p class="comment-form-author">' .
			      '<label for="author">' . __( 'Name', 'domainreference' ) . '</label> ' .
			      ( $req ? '<span class="required">*</span>' : '' ) .
			      '<input id="author" name="author" type="text" required placeHolder="Entrez votre nom..." size="30"' . $aria_req . ' /></p>',

			    'email' =>
			      '<p class="comment-form-email"><label for="email">' . __( 'Email', 'domainreference' ) . '</label> ' .
			      ( $req ? '<span class="required">*</span>' : '' ) .
			      '<input id="email" name="email" type="email" required placeHolder="Entrez votre email..." size="30"' . $aria_req . ' /></p>',

			    'url' =>
			      '<p class="comment-form-url"><label for="url">' .
			      __( 'Website', 'domainreference' ) . '</label>' .
			      '<input id="url" name="url" type="url" placeHolder="Entrez votre site web..." size="30" /></p>
			      </div>'
			    ) 

		    );

		comment_form($args);
		?>
		<div class="spacer"> </div>
	</div>
	<?php 
		endif;
	?>
</div>
