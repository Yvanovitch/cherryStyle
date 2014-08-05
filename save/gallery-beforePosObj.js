/**
 * gallery.js
 *
 * Affiche successivement les images en plein écran

TODO :
//Gérer le scrolling en parallax de gallery-meta 
//Gérer les petites images, mal placée
//Gérer la transition avec des fadeIn fadeOut.
Bloquer le défilement des images avant qu'elle ne dépasse.
Ralentir le défilement des images, comme sur le site -> http://community.saucony.com/kinvara3/
Masquer les commentaires si trop long 
Bouton défilement automatique -> http://css-tricks.com/snippets/jquery/smooth-scrolling/ http://www.intacto10years.com/index_start.php
? Voir site award winner pour barre de défilement

//Barre de défilement en bas comme sublime
bouton de play/pause
//Quand souris à droite de meta, laisser en hover
Laisser sur la même page après commentaire
Modifier l'url au fur et à mesure du défilement
Mettre en fixed même quand l'image n'est pas assez grande pour faire une transition normale
Lien pour télécharger toutes les images 
Pouvoir choisir d'utiliser les images en height max plutôt que width max
Tester retour arrière si pas assez descendu --> Ralentir le délifement de l'image pour indiquer qu'on y arrive

Rapide :
//Quand on fait play, ne compter que le temps nécessaire, pas total
Changer couleur de fond de la flêche 
Next avec fleche droite et bas, lecture auto avec space --> Bulle d'aide
Bouton pour revenir en haut
Enlever next à chaque click
Si clique sur bar cursor, afficher la bar et la verrouiller. De même pour la zone de commentaire
//Changer l'ancrage quand on fait next pour tomber en plein milieu en cas de isNotFull

Bug : 
//Pas moyen d'activer manageScroll au chargement de la page --> Se corrigera avec l'url
//Lorsque l'on est à la dernière image et qu'on descend plus bas, elle se colle en fixed bottom et ne devrait pas
//Marge noir en haut
//Flêche sous Chrome
Envoie commentaire juste en faisant Enter
Body trop grand, laisser une marge en cas isNotFull

Note : 
Plutôt que fadeIn, on pourrait utiliser le css pour gérer la transition avec un timeout pour passer l'élement en display:none;
Changer la couleur du fond de la bar régulièrement, effet stylé avec opacity 0.9
Mettre un fond avec plein de flêche downarrow

 */
( function($) {
	var delta = 130;
	if($('.gallery-item').length <= 0) {
		return;
	}

	var lastScrollTop = 0, deltaScroll = 5;
	var isScrollingDown = true;
	var oriWidthWindow;

	pos = [];

	function initialize() {
		var wh = $(window).height();	
		
		$('.gallery-item').each(function(i) {
			var img = $(this).children('.gallery-img').first(); // Get my img elem
			var pic_real_width, pic_real_height;

			pos[i] = {
				bot:0, top:0, offset:0, isTooSmall:false, 
				width:img.width(),
				height:img.height()
			};

			//On place et affiche l'image rapidement avant les autres fonctions
			if(i == 0 ) {
				var height = img.height();
						
				if(height - 2 * delta < wh) 	$(this).offset({top: wh / 2 - height / 2 });
				else	$(this).offset({top:0});
				$(this).fadeIn(1000);
			}
		});
	}

	function computeImageSize() {
		$('.gallery-item').each(function(i) {
			var img = $(this).children('.gallery-img').first();
			//On récupère la taille naturelle des images
			$("<img/>")
			    .attr("src", $(img).attr("src"))
			    .load(function() {
			        pos[i].width = this.width;   // Note: $(this).width() will not
			        pos[i].height = this.height; // work for in memory images.
			    });
		});
	}

	var currentItem = $('.gallery-item').first();
	var prevItem = currentItem.next();

	function screenFunc () {
		var moveToLock = false;
		var currentTarget;
		var st = 0;

		function moveToComplete () {
			moveToLock = false;
			currentTarget = null;
			console.log('complete')
		}

		this.moveTo = function (t) {
			moveTo(t, 1200);
			console.log('test')
		}
		//move screen to target t in during time ms
		this.moveTo = function (t, time) {
			if(moveToLock) return;
			if(currentTarget == t) { return;}
			if(time < 50) time = 50;

			var target;
			if(pos[t].isTooSmall) {
				console.log('too small');
				target = pos[t].offset + getHeight(t)/2 - $(window).height() / 2;
			}
			else {
				if(t < currentItem.index() && t > 0 )	target = pos[t].bot;
				else if (t == pos.length-1 && currentItem.index() == pos.length-1)	target = pos[t].bot;
				else target = pos[t].top;
			}
				
			moveToLock = true;
	    	currentTarget = t;
	    	//Mettre peut être 'html,body'
			$('html').animate({
	      		scrollTop: target
	    	}, time, moveToComplete);
		}		

		//Gestion scrolling
		this.manageScroll = function () {
			var i = currentItem.index();

			//On détermine le sens :
			st = $(window).scrollTop();
			
			if(Math.abs(lastScrollTop - st) <= deltaScroll)
			  return;

			if (st > lastScrollTop){
			   isScrollingDown = true;	// downscroll code
			} else {
			  isScrollingDown = false;	// upscroll code
			}
			lastScrollTop = st;

			if(pos[i] == undefined) {
				return;
			}

			manageItems();
		}

		function manageItems() {
			var i = currentItem.index();

			//Si on passe au suivant
			if( st > pos[i].bot && isScrollingDown) {
				if( i < pos.length-1) {
					prevItem = currentItem;
					prevItem.stop().fadeTo("slow", 0);

					//Changement de currentItem			
					while(i < pos.length-1 && pos[i].bot < st ) { i++; currentItem = currentItem.next();}

					console.log('i '+i+' st '+st+' posbot '+pos[i].bot);

					currentItem.children('.gallery-img').removeClass('fixed-bottom');
					currentItem.children('.gallery-img').removeClass('fixed-top');
					currentItem.stop().fadeTo("slow", 1);
					bar.managePosition();

					if(pos[i].isTooSmall) {
						screen.moveTo(i, 600);
					}
				}
				else {
					screen.moveTo(i, 600);
				}
			}
			//Si on passe au précédent
			else if ( st < pos[i].top && !isScrollingDown ) {
				console.log('i '+i+' st '+st+' posbot '+pos[i].bot);
				//S'il existe un élément précédent
				if(i > 0) {
					prevItem = currentItem;
					prevItem.stop().fadeTo("slow", 0);
					//Changement de currentItem
					while(pos[i].top > st && i > 0) { i--; currentItem = currentItem.prev();}
					currentItem.children('.gallery-img').removeClass('fixed-bottom');
					currentItem.children('.gallery-img').removeClass('fixed-top');
					currentItem.stop().fadeTo("slow", 1);
					bar.managePosition();

					if(pos[i].isTooSmall) {
						screen.moveTo(i, 600);
					}
				}
			}
			//si on arrive à la limite de l'image précédente, on la bloque en position fixed
			if(!pos[prevItem.index()].isTooSmall) {
				var prevImg = prevItem.children('.gallery-img');
				if(!prevImg.hasClass('fixed-bottom') && 
					st + $(window).height() > prevImg.offset().top + prevImg.height() 
					) {
					console.log('scroll '+ (st + $(window).height() ) + ' bot : '+ (pos[prevItem.index()].bot + delta ) );
					prevItem.children('.gallery-img').addClass('fixed-bottom');
				} 
				else if( !prevImg.hasClass('fixed-top') && 
					st < prevImg.offset().top ) {
					prevItem.children('.gallery-img').addClass('fixed-top');
				}
			}
		};
	}


	function manageBar() {
		var bar = $('.gallery-bar');
		var cursor = $('.gallery-bar-cursor');
		var thumbnailWidth = 150;

		this.manageClick = function() {
			$('li[class=gallery-bar-item]').click(function(e) {
				screen.moveTo($(e.delegateTarget).index());
			})
		}

		function width () {
			return pos.length * thumbnailWidth;
		}

		this.managePosition = function () {
			var index = currentItem.index();

			//console.log('bar '+width()+' window '+$(window).width());

			if(width() <= $(window).width()) {
				//On centre la bar
				var margeLeft = ( $(window).width() - width() ) /2;
				bar.css('left','auto');
				var placeLeft = margeLeft + 50 + index * thumbnailWidth;
				cursor.css('left', placeLeft+'px');
			}
			else {
				if(pos.length <= 1) return;

				var left = - (index / (pos.length - 1)) * (width() - $(window).width());
				bar.css('left', left+'px');
				var placeLeft = left + 50 + index * 150;
				cursor.css('left', placeLeft+'px');
			}
		}
	}

	function getHeight(i) {
		var height;
		if($(this).children('.gallery-img').height() > 0) {
			height = $(this).children('.gallery-img').height();
		}
		else {
			//Calcul de height alors qu'il est en fadeOut()
			if($(window).width() < pos[i].width) {
				height = $(window).width() * pos[i].height / pos[i].width;
			}
			else {
				height = pos[i].height; 
			}
		}
		return height;
	}

	function computeOffset() {

		$('.gallery-item').each(function(i) {
			var height = getHeight(i);
			var wh = $(window).height();			

			//Calcul limit bot :
			if(height - 2 * delta < wh) {
				//console.log('isTooSmall'+i)
				pos[i].isTooSmall = true;
				if(i > 0) {
					pos[i].offset = pos[i-1].bot  + wh / 2 - height / 2 + 1.3 * delta;
					pos[i].bot  = pos[i].offset + height / 2 + 0.3 * delta - wh / 2 ;
				}	
				else {
					pos[0].offset = wh / 2 - height / 2;
					pos[0].bot = pos[0].offset + height / 2 + 1 * delta - wh / 2 ;
				}
			}
			else {
				pos[i].isTooSmall = false;
				if(i > 0) {
					pos[i].offset = pos[i-1].bot;
					pos[i].bot = pos[i].offset + height - wh - delta;
				}
				else {
					pos[0].offset = 0;//$(this).offset().top;
					pos[0].bot = pos[0].offset + height - delta - wh;
				}
			}

			$(this).offset({top : pos[i].offset});
			$('body').height(pos[pos.length-1].offset + getHeight(pos.length-1) );
			
			if(i > 0 ) {
				pos[i].top = pos[i-1].bot + delta;
			}
			//console.log(i+ ' : bot : '+Math.round(pos[i].bot)+', top : '+Math.round(pos[i].top)+', offset : '+Math.round(pos[i].offset)+", height : "+Math.round(height));
			
		});
	};

//Gestion de la lecture automatique
	var isPlaying = false;
	$('.gallery-item').click(function() {

		if(isPlaying) {
			$('html,body').stop();
			isPlaying = false;
		}
		else {
			var target = (currentItem.index() + 1)%pos.length;
			
			screen.moveTo(target);

	    	isPlaying = true;
	    	setTimeout(function() {
	    		isPlaying = false;
	    	}, 1000);
	    	return false;//*/
	    }
	})

	var bar = new manageBar();
	var screen = new screenFunc();

	$(window).load(function() {
		initialize();
		computeOffset();
		screen.manageScroll();
		bar.managePosition();
		bar.manageClick();
	});
	//Permet de recalculer les images avec les bonnes dimensions
	setTimeout(computeImageSize,800);
	setTimeout(computeOffset,1000);
	setTimeout(computeOffset,2000);
	$(window).on('resize', function() {
		computeOffset();
		bar.managePosition();
		});
	$(window).scroll(screen.manageScroll);

} )(jQuery);




//Gère la réapparition de la flêche au dessus des commentaires
(function($) {
	function foo () {
		var shooted = false;
		var isIn = false;
		var target = null;

		function setTarget(e) {
			target = $(e.delegateTarget);
		}

		function timeoutFunc() {
			if(!isIn) {
				shooted = false;
				target.children('.gallery-arrow').removeClass('gallery-arrow-shoot');
			}
		}

	  	this.myHover = function (e) {
	  		setTarget(e);

			if(e.type === 'mouseenter') {
				if(!shooted ) {
					target.children('.gallery-arrow').first().addClass('gallery-arrow-shoot');
					shooted = true;
					//console.log('shooot');
				}
				isIn = true;
			} 
			else {
				setTimeout(timeoutFunc, 2000);
				isIn = false;
			}
		}
	}

	var obj = new foo();
	$('.gallery-meta-box').hover(obj.myHover);

}) (jQuery);