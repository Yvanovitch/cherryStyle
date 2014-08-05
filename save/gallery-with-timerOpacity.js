/**
 * gallery.js
 *
 * Affiche successivement les images en plein écran

TODO :
Gérer le scrolling en parallax de gallery-meta
Gérer les petites images, mal placée
Gérer la transition avec des fadeIn fadeOut.
Bloquer le défilement des images avant qu'elle ne dépasse.
Ralentir le défilement des images, comme sur le site -> http://community.saucony.com/kinvara3/
Masquer les commentaires si trop long 
Bouton défilement automatique -> http://www.intacto10years.com/index_start.php
Voir site award winner pour barre de défilement




 */
( function($) {
	var delta = 130;
	if($('.gallery-item').length <= 0) {
		return;
	}
	var currentImg = $('.gallery-item').first();
	currentImg.css('opacity',1);
	var transImg = currentImg.next();

	pos = [];

	for(var i = 0; i < $('.gallery-item').length; i++) {
		pos[i] = {bot:0, top:0, offset:0};
	}

	var computeOffset = function() {
		console.log('window height : '+$(window).height());
		//Première image
		var currentImg = $('.gallery-item').first();
		pos[0].top = -10;
		pos[0].offset = currentImg.offset().top;

		var height = currentImg.children('.gallery-img').height();
		console.log('height img : '+height);

		if(height - 2 *delta < $(window).height()) {
			pos[0].bot = pos[0].offset + height / 2 + 1 * delta - $(window).height() / 2 ;
		}
		else {
			pos[0].bot = currentImg.offset().top + height - delta - $(window).height();
		}
		console.log(0+ ' : bot : '+Math.round(pos[0].bot)+', top : '+Math.round(pos[0].top)+', offset : '+pos[0].offset+", height : "+Math.round(height));

		currentImg = currentImg.next();

		for(var i = 1; i < $('.gallery-item').length; i++) {
			pos[i] = {bot:0, top:0, offset:0};

			//Calcul limit bot :
			if(height - 2 * delta < $(window).height()) {
				pos[i].offset = pos[i-1].bot  + $(window).height() / 2 - height / 2 + 1.3 * delta;
				pos[i].bot  = pos[i].offset + height / 2 + 0.3 * delta - $(window).height() / 2 ;
			}
			else {
				pos[i].offset = pos[i-1].bot;
				pos[i].bot = pos[i].offset + height - $(window).height() - delta;
			}

			currentImg.offset({top : pos[i].offset});
			pos[i].top = pos[i-1].bot;
			
			console.log(i+ ' : bot : '+Math.round(pos[i].bot)+', top : '+Math.round(pos[i].top)+', offset : '+Math.round(pos[i].offset)+", height : "+Math.round(height));
			currentImg = currentImg.next();
		}
	};
	//computeOffset();
	$(window).load(computeOffset);
	$(window).on('resize', computeOffset);

	//Gestion opacité pour ne pas rester sur une opacité intermédiaire
	setInterval(function() {
		if(
			(
				(currentImg.css('opacity') != 1 && currentImg.css('opacity') != 0) ||
				(transImg.css('opacity') != 1 && transImg.css('opacity') != 0) && transImg.index() >= 0 )
		&& (
				($(window).scrollTop() > pos[currentImg.index()].bot && isScrollDown && currentImg.index() < $('.gallery-item').last().index()) ||
				($(window).scrollTop() < pos[currentImg.index()].top + delta && !isScrollDown && currentImg.index() > 0) ) ) {

			currentImg.css("opacity", Math.max(0, currentImg.css('opacity') - 0.05));
			transImg.css("opacity", Math.min(1, +transImg.css('opacity') + 0.05));
		}
		else {
			currentImg.css("opacity", Math.min(1, +currentImg.css('opacity') + 0.05));
			transImg.css("opacity", Math.min(1, +transImg.css('opacity') - 0.05));
		}
		if( transImg.css('opacity') >= 1 && +currentImg.css('opacity') <= 0) {
			if(transImg.index() > currentImg.index() && currentImg.next().length) {
				currentImg = currentImg.next();
				if(currentImg.index() == $('.gallery-item').last().index()) {
					transImg = currentImg.prev();
				}
				else {
					transImg = currentImg.next();
				}
			}
			else if(transImg.index() < currentImg.index() && currentImg.prev().length && transImg.index() >= 0) {
				currentImg = currentImg.prev();
				if(currentImg.index() == 0) {
					transImg = currentImg.next();
				}
				else {
					transImg = currentImg.prev();
					console.log('trans index : '+transImg.index())
				}
			}
		}
    }, 50);


	currentImg = $('.gallery-item').first();
	var lastScrollTop = 0, deltaScroll = 5;
	var isScrollDown = true;

	//Gestion scrolling
	$(window).scroll(function(event) {
		//On détermine le sens :
       var st = $(this).scrollTop();
       
       if(Math.abs(lastScrollTop - st) <= deltaScroll)
          return;
       
       if (st > lastScrollTop){
           // downscroll code
           isScrollDown = true;
       } else {
          // upscroll code
          isScrollDown = false;
       }
       lastScrollTop = st;

		//console.log("offset: "+Math.round(currentImg.offset().top) +" offsetnext : "+Math.round(transImg.offset().top) +" scroll "+Math.round($(window).scrollTop()) );
		if($(window).scrollTop() > pos[currentImg.index()].bot && isScrollDown ) {
			//S'il existe un élément suivant
			if(currentImg.next().length) {
				//Changement opacité current
				var opacityEcart = 1-($(window).scrollTop() - pos[currentImg.index()].bot ) / delta;
				if(opacityEcart < currentImg.css('opacity')) {
					currentImg.css("opacity", opacityEcart);
				}

				//Transition terminée, par scroll ou par l'interval
				if( ($(window).scrollTop() > pos[currentImg.index()].bot  + delta) ||
					(+transImg.css('opacity') >= 1 && +currentImg.css('opacity') <= 0) ) {
					currentImg = currentImg.next();
					transImg = currentImg.next();
					transImg.css('opacity',0);
				}
				else {
					if(transImg.index() != currentImg.next().index()) {
						transImg.css('opacity',0);
						transImg = currentImg.next();
					}

					if(transImg.css('opacity') <= 0) {
						transImg.css('opacity', 0.05);//($(window).scrollTop() - pos[currentImg.index()].bot) / delta) );	
					}
				}
			}	
		}
		else if ($(window).scrollTop() < pos[currentImg.index()].top + delta && !isScrollDown) {
			//S'il existe un élément précédent
			if(currentImg.index() > 0) {
				if(($(window).scrollTop() - pos[currentImg.index()].top ) / delta < currentImg.css('opacity')) {
					currentImg.css("opacity", ($(window).scrollTop() - pos[currentImg.index()].top ) / delta);
				}
				//Si on est plus haut que l'image courante, la transition est terminée
				if($(window).scrollTop() < pos[currentImg.index()].top  - delta ||
					transImg.css('opacity') == 1 && currentImg.css('opacity') == 0)  {
					transImg = currentImg;
					currentImg = currentImg.prev();
					//currentImg.css('opacity',1);
					transImg.css('opacity',0);
				}
				else {
					if(transImg.index() != currentImg.prev().index()) {
						transImg.css('opacity',0);
						transImg = currentImg.prev();
					}
					
					if(transImg.css('opacity') <= 0) {
						transImg.css('opacity', 0.05);//1-($(window).scrollTop() - pos[currentImg.index()].top ) / delta) );
					}
				}
			}
		}
	});
} )(jQuery);
