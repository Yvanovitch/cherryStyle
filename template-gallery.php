<?php
/*
Template Name: Template-Gallery
 *
 * @package cherrystyle

 Aide : http://wordpress.org/ideas/topic/functions-to-get-an-attachments-caption-title-alt-description
 */
 
$galleries = get_post_galleries( get_the_ID(), false );

$images = [];

foreach ($galleries as $gallery) {
    foreach ( explode(',', $gallery['ids']) as $id ) {
        $images[] = get_post($id);
    }
}
 
if($images){ ?>
<div id="cherry-gallery">
    <div class="gallery-button-area">
        <div id="gallery-escape-button" class="gallery-button"/></div>
        <div id="gallery-help-button" class="gallery-button" /></div>
        <div id="gallery-play-button" class="gallery-button" /></div>
        <div id="gallery-fullscreen-button" class="gallery-button" /></div>
    </div>
    <ul id="gallery-help-area">
        <li>Utilisez la barre de navigation en bas pour aller à une photo particulière</li>
        <li>Survolez la partie droite de l'écran pour accéder à la description et aux commentaires</li>
        <li>Touche <kbd>espace</kbd> -> Lecture automatique</li>
        <li>Touche <kbd>Maj</kbd> + <kbd>f</kbd> -> Plein écran</li>
        <li>Touche <kbd>escape</kbd> -> Sortie du plein écran</li>
        <li>Flèche droite -> Photo suivante</li>
        <li>Flèche gauche -> Photo précédente</li>
    </ul>
    <ul class="gallery-items-list">
    <?php foreach($images as $post){ 
        $image = wp_get_attachment_image_src( $attachment_id, $full );?>
        <li class="gallery-item">
            <img class="gallery-img" src="<?php echo $image[0]; ?>" width="<?php echo $image[1]; ?>" height="<?php echo $image[2]; ?>" alt="<?php echo get_post_meta( $post->id, '_wp_attachment_image_alt', true ); 
                ?>" title="<?php echo $post->post_title; ?>" />
            <div class="gallery-meta-area">
                <div class="gallery-meta-box">
                    <div class="gallery-title"><?php echo $post->post_title; ?></div>
                    <img class="gallery-arrow " src="<?php echo get_template_directory_uri(); ?>/images/downarrow-white.svg" alt="More content..."/>
                    <div class="gallery-meta">
                        <div class="gallery-caption"><?php echo $post->post_excerpt; ?></div>
                        <div class="gallery-desc"><?php echo $post->post_content; ?></div>
                        <div class="gallery-comments"><?php comments_template();  ?></div>
                    </div>
                </div>
            </div>
            <div class="spacer"> </div>
        </li>
    <?php } ?>
    </ul>

    <div class="gallery-bar-area">
        <img class="gallery-bar-cursor" src="<?php echo get_template_directory_uri(); ?>/images/downarrow-color.svg" alt="Select your image"/>
        <ul class="gallery-bar">
            <?php foreach($images as $post){ 
                $image = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );?>
                <li class="gallery-bar-item">
                    <div class="gallery-bar-img" style="background-image:url('<?php echo $image[0]; ?>')"  alt="<?php echo get_post_meta( $post->id, '_wp_attachment_image_alt', true ); 
                        ?>" title="<?php echo $post->post_title; ?>" > </div>
                </li>
            <?php } ?>
        </ul>
    </div>
</div>

<?php wp_reset_postdata();
 } ?>
