<?php
/*
Template Name: Template-Gallery
 *
 * @package cherrystyle

 Aide : http://wordpress.org/ideas/topic/functions-to-get-an-attachments-caption-title-alt-description
 */
 
    $galleries = get_post_galleries( get_the_ID(), false );

    foreach ($galleries as $gallery) {
        echo $gallery[ids];
        foreach ( explode(',', $gallery['ids']) as $id ) {
            $post = wp_prepare_attachment_for_js($id);
            echo $id.' src : '.$post['src'].'<br>';
        }
        
    }


 
$args = array(
    'numberposts' => -1, // Using -1 loads all posts
    'orderby' => 'menu_order', // This ensures images are in the order set in the page media manager
    'order'=> 'ASC',
    'post_mime_type' => 'image', // Make sure it doesn't pull other resources, like videos
    'post_parent' => $post->ID, // Important part - ensures the associated images are loaded
    'post_status' => 'inherit',
    'post_type' => 'attachment'
);
 
$images = get_children( $args );

if($images){ ?>
<div id="cherry_gallery">
    <?php foreach($images as $post){ ?>
    <div class="gallery-item">
        <img class="gallery-img" src="<?php echo $post->guid; ?>" alt="<?php echo get_post_meta( $post->ID, '_wp_attachment_image_alt', true ); ?>" title="<?php echo $post->post_title; ?>" />
        <div class="gallery-meta-box">
            <div class="gallery-title"><?php echo $post->post_title; ?></div>
            <div class="gallery-meta">
                <div class="gallery-caption"><?php echo $post->post_excerpt; ?></div>
                <div class="gallery-desc"><?php echo $post->post_content; ?></div>
                <div class="gallery-comments"><?php comments_template();  ?></div>
            </div>
        </div>
    </div>
    <?php } ?>
</div>

<?php wp_reset_postdata(); } ?>
