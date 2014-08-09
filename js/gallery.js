/**
 * gallery.js
 *
 * Affiche successivement les images en plein écran

TODO :
//Gérer le scrolling en parallax de gallery-meta 
//Gérer les petites images, mal placée
//Gérer la transition avec des fadeIn fadeOut.
//Bloquer le défilement des images avant qu'elle ne dépasse.
//?Ralentir le défilement des images, comme sur le site -> http://community.saucony.com/kinvara3/
//Défilement automatique -> http://css-tricks.com/snippets/jquery/smooth-scrolling/ http://www.intacto10years.com/index_start.php
//Barre de défilement en bas comme sublime
BOUTON de play/pause, Bulle d'aide, Bouton pour revenir en haut 
//Quand souris à droite de meta, laisser en hover
//Laisser sur la même page après commentaire
Mettre en fixed même quand l'image n'est pas assez grande pour faire une transition normale
//?Tester retour arrière si pas assez descendu --> Ralentir le délifement de l'image pour indiquer qu'on y arrive

//Voir pourquoi Ajaxify ne fonctionne pas sur plusieurs articles en même temps >> http://wordpress.org/support/topic/multiple-comment-forms-on-a-single-page
//Lier le nouveau form à l'envoi par "Entrer" : http://wordpress.org/plugins/wp-ajaxify-comments/faq/ -> OnAfterUpdateComments

Rapide :
//Quand on fait play, ne compter que le temps nécessaire, pas total
//Changer couleur de fond de la flêche 
//Next avec fleche droite et bas, lecture auto avec space 
//Si clique sur bar cursor, afficher la bar et la verrouiller. De même pour la zone de commentaire
//Changer l'ancrage quand on fait next pour tomber en plein milieu en cas de isNotFull
? Masquer toute l'interface quand mode lecture
//espace pour lancer diaporama et arrêters
//Masquer les commentaires si trop long 
//Récupérer les valeur height et width des images depuis le html
Quand user poste un commentaire, afficher à gauche le formulaire pour entrer ses informations perso, puis lui indiquer lesquelles ne sont pas entrée quand il fait entré
? Passer à la suivante quand on fait play autoplay
Choisir avec une variable d'afficher les images portrait redimentionné
//Lorsqu'on a cliqué sur l'aide et qu'on clique à côté, enlever l'aide
//Changer système qui check les inputs par placeHolder -> http://www.scottohara.me/article/mini-demos.html

-> Comments :
Quand on clique n'importe où dans un champ, toujours entrer en mode édition
//Lorsque le plugin ajaxify recharge, attacher de nouveau les input à jQuery
 Utiliser ::before pour ajouter les "*" dans aux champs obligatoires
 //Lorsqu'on clique sur un champ, ne pas cacher le block si la sourie sort

Bug : 
//Pas moyen d'activer manageScroll au chargement de la page --> Se corrigera avec l'url
//Lorsque l'on est à la dernière image et qu'on descend plus bas, elle se colle en fixed bottom et ne devrait pas
//Marge noir en haut
//Flêche sous Chrome
//Envoie commentaire juste en faisant Enter --> Ne pas entrer en collision avec fullscreen -> CHanger raccourcie
//Body trop grand
//laisser une marge en cas isNotFull
//Lors d'un moveTo, désactiver le scrolling manuel
//Si on clique sur une image de la barre, on arrête la lecture auto
//Quand on quitte le fullscreen, mettre à jour l'icône
//Passer les images en background-image
//Pouvoir utiliser espace dans les commentaires
//Corriger l'icône de plein écran
Affichage de la dernière image lorsqu'elle est en trop petite, manque de marge :s
//Drôle de marge pour certaines images
//Lorsqu'on utilise la scrollBar, ne pas faire les transition

Plus : 
Mettre un flou autour des images
Charger les commentaires à la demande -> Puis envoyer un review à l'auteur du plugin
Si l'user est sur un mobile, n'envoyer que les petites images, pas les full
Charger les images de manières asynchrone
Utiliser un framework MVC !!!
Plutôt que fadeIn, on pourrait utiliser le css pour gérer la transition avec un timeout pour passer l'élement en display:none;
->Voir même velocity.js
Changer la couleur du fond de la bar régulièrement, effet stylé avec opacity 0.9
Mettre un fond avec plein de flêche downarrow
Animer les boutons, notamment play/pause
Pouvoir cliquer sur la flêche de la barre et faire défiler comme une scrollBar
Lien pour télécharger toutes les images 
Modifier l'url au fur et à mesure du défilement


 */
( function($) {
	var delta = 130;
	if($('.gallery-item').length <= 0) {
		return;
	}

	var lastScrollTop = 0, deltaScroll = 5;
	var isScrollingDown = true;
	var oriWidthWindow;
	var isTransitionModeAuto = true;
	var scrollTimeLongImage = 4000;
	var diaporamaTime = 6000;
	var transitionScrollTime = 1000;

	var currentItem,
		prevItem;

	Array.prototype.first = function () {
	    return this[0];
	};

	Array.prototype.last = function () {
	    return this[this.length-1];
	};

	pos = [];

	function item(myItem) {
		var bot = 0, 
			top = 0, 
			offset = 0,
			myIsTooSmall = false;
		var naturalWidth = 0, 
			naturalHeight = 0;

		var img = myItem.children('.gallery-img').first();
		var myIndex = myItem.index();

		this.index = function () {
			return myIndex;
		}
		this.elem = function () {
			return myItem;
		}
		this.offset = function (value) {
			if(typeof value === 'undefined') return offset;

			myItem.offset({top:value});
			//img.offset({top:value});
			offset = value;
		}
		this.middle = function () {
			//Va buguer à cause de this.height()
			return this.offset() + ( this.height() - $(window).height() ) / 2;
		}

		this.width = function() {
			if(img.height() > 0) {
				return img.height();
			}
			else if ( naturalWidth > 0 ) {
				if( naturalWidth < $(window).width()) {
					return naturalWidth;
				}
				else 
					return $(window).width();
			}
			else return 500;
		}

		this.height = function() {
			if(img.height() > 0) {
				return img.height();
			}
			else if ( naturalHeight > 0 && naturalWidth > 0 ) {
				//Calcul de height alors qu'il est en fadeOut()
				if($(window).width() < naturalWidth) {
					return $(window).width() * naturalHeight / naturalWidth;
				}
				else {
					return naturalHeight; 
				}
			}
			else return 500; // Valeur arbitraire car la vrai est inaccessible
		}

		this.naturalWidth = function() {
			return naturalWidth;
		}

		this.naturalHeight = function() {
			return naturalHeight;
		}

		this.computeNatural = function() {
			if(typeof img.attr('height') !== null && typeof img.attr('width') !== null) {
				naturalHeight = img.attr('height');
				naturalWidth = img.attr('width');
			}
			else {
				//On récupère la taille naturelle des images
				$("<img/>")
				    .attr("src", $(img).attr("src"))
				    .load(function() {
				        naturalWidth = this.width;   // Note: $(this).width() will not
				        naturalHeight = this.height; // work for in memory images.
				    });
			}
		}

		this.isTooSmall = function(value) {
			if(typeof value === 'undefined')	return myIsTooSmall;

			myIsTooSmall = value;
			return value;
		}

		this.isPortrait = function() {
			if(naturalHeight !== 'undefined' && typeof naturalWidth !== 'undefined')
				return (naturalWidth < naturalHeight);
			else return this.width() < this.height();
		}

		this.img = function () {
			return img;
		}

		this.fadeOut = function (time) {
			if(typeof time === 'undefined') time = 1000;
			//On verra pour utiliser directement le css plutôt que jQuery
			myItem.stop().fadeTo(time, 0);myItem.find('.comments-box').removeClass('active');
			changeComments(false);
		}

		this.fadeIn = function (time) {
			if(typeof time === 'undefined') time = 1000;
			//On verra pour utiliser directement le css plutôt que jQuery
			img.removeClass('fixed-bottom');
			img.removeClass('fixed-top');
			myItem.stop().fadeTo(time,1);
			changeComments(true);
			//console.log('i : '+this.index()+' fadeIn '+time)
		}

		function changeComments(isActive) {

			if(isActive) {
				/*
				myItem.find('.comments-box').addClass('active');
				myItem.find('.respond-block').addClass('active');
				*/
				myItem.find('.comments-box').attr('id', 'comments');
				myItem.find('.respond-block').attr('id', 'respond');
				myItem.find('.comment-form').attr('id', 'commentform');
			}
			else  {
				/*myItem.find('.comments-box').removeClass('active');
				myItem.find('.respond-block').removeClass('active');
				*/
				myItem.find('.comments-box').attr('id', 'comments-inactive');
				myItem.find('.respond-block').attr('id', 'respond-inactive');
				myItem.find('.comment-form').attr('id', 'commentform-inactive');
			}
			//console.log('id comments : '+ myItem.find('.comment-form').attr('id')+ ' class: '+ myItem.find('.comment-form').attr('class') );
		}

		this.fixBottom = function() {
			img.addClass('fixed-bottom')
		}

		this.fixTop = function() {
			img.addClass('fixed-top')
		}
	} // Fin de l'objet Item


	function initialize() {
		var wh = $(window).height();	
		
		$('.gallery-item').each(function(i) {

			var obj = new item($(this));

			pos[i] = obj;

			//On place et affiche l'image rapidement avant les autres fonctions
			if(i == 0 ) {
				var height = obj.height();
						
				if(height - 2 * delta < wh) 	obj.offset( wh / 2 - height / 2 );
				else	obj.offset(0);
				obj.fadeIn(1000);
			}
		});
	}

	function computeImageSize() {
		$.each(pos, function(i) {
			this.computeNatural();
		});
	}


















	function screenFunc () {
		var isScrollLocked = false;
		var hasClickedScrollBar = false;
		var currentTarget;
		var st = 0;

		var keysPrevious = [33, 37, 38]
		var keysNext = [34, 39, 40];
		var oldScrollTop;
		var shouldScrollOnImg = false;	//Finalement Désactivé, à voir quand l'appliquer vraiment 
		var isFullScreen = false;

		function moveToComplete () {
			//On continue à faire slider si c'est un portrait en lecture auto
			if(shouldScrollOnImg && 
				pos[currentItem.index()].isPortrait() && 
				isTransitionModeAuto) {
				var target;
				shouldScrollOnImg = false;

				lockScroll();

				if(prevItem.index() < currentItem.index())
					target = pos[currentItem.index()].bot - 25; //-25 pour éviter de slider à la suivante
				else 
					target = pos[currentItem.index()].top + 25;

				$('html,body').animate({
		      		scrollTop: target
		    	}, scrollTimeLongImage, moveToComplete);
			}
			else {
				currentTarget = null;
				unlockScroll();
				shouldScrollOnImg = false;
			}

		}

		//move screen to target t in during time ms
		this.moveTo = function (t, time) {
			//console.log('move to '+t, time)
			if(isScrollLocked) return;
			if(!isTransitionModeAuto) return;
			if(currentTarget == t) { return;}
			if(time < 50 ||typeof time === 'undefined') time = transitionScrollTime;
			if(t >= pos.length) t = pos.length-1;
			if(t < 0) t = 0;
			var target;

	    	prevItem = currentItem;
	    	currentItem.fadeOut();

	    	if(pos[t].isPortrait() && pos[t].height() > $(window).height()) {
	    		if(t >= currentItem.index()) 
	    			target = pos[t].top;
	    		else 
	    			target = pos[t].bot - 10;
	    		//shouldScrollOnImg = true; Fonctionnalité désactivée
	    	}
	    	else
	    		target = pos[t].middle();
	    		
	    	currentTarget = t;
	    	currentItem = pos[t];
	    	currentItem.fadeIn();

	    	lockScroll();

			$('html,body').stop().animate({
	      		scrollTop: target
	    	}, time, moveToComplete);
	    	//console.log('target : '+target)
	    	bar.managePosition();
		}		

		//Gestion des touches
		this.manageKey = function (e) {
			//Si on est en cours d'animation, on bloque le scrolling, on ne gère plus les items
			if(isScrollLocked) {
				for (var i = keysNext.length; i--;) {
			        if (e.keyCode === keysNext[i-1]) {
			            e.preventDefault();
			            e.stopPropagation();
			            return false;
			        }
			    }
			    for (var i = keysPrevious.length; i--;) {
			        if (e.keyCode === keysPrevious[i-1]) {
			            e.preventDefault();
			            e.stopPropagation();
			            return false;
			        }
			    }
			}

			//Si on est dans un champ de texte, on ne fait rien
			if(e.target.tagName == 'INPUT') {
				return;
			}

			//Suivant :
			for (var i = keysNext.length; i--;) {
		        if (e.keyCode === keysNext[i]) {
		        	screen.moveTo(currentItem.index()+1);
		        	autoPlay.stop();
		            e.preventDefault();
		            e.stopPropagation();
		            return false;
		        }
		    }
		    for (var i = keysPrevious.length; i--;) {
		        if (e.keyCode === keysPrevious[i]) {
		        	screen.moveTo(currentItem.index()-1);
		        	autoPlay.stop();
		            e.preventDefault();
		            e.stopPropagation();
		            return false;
		        }
		    }

		    e = e || window.event;

		    switch(e.keyCode) {
		    	case 70 : //Maj + f : Envoie d'un commentaire 
		    		if(e.shiftKey) {
		    			screen.fullScreenToggle();
		    		}
		    		break;
		    	case 27 : 	//Echappe
		    		autoPlay.stop();
		    		buttonBar.fullScreenChangeEvent(false);
		    		console.log('echap');
		    		break;
		    	case 32 : 	//Espace
		    		e.preventDefault();
					e.stopPropagation();
					autoPlay.toggle();
					break;
		    }
		    //console.log('keypress : '+e.keyCode);
		}

		//Gestion scrolling
		this.manageScroll = function (e) {
			
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

			manageItems();
		}

		this.manageScrollBar = function (e) {

		    $('HTML').mousedownScroll(function() {
		        hasClickedScrollBar = true;
		        isTransitionModeAuto = false;
		    });
			hasClickedScrollBar = true;

			//Gestion du bouton du milieu
			$(window).on('mousedown', function(e) {
				if(e.which == 2) {
					hasClickedScrollBar = true;
					isTransitionModeAuto = false;
				}
			});

		 	$(window).on('mouseup', function (e) {
		    	if(hasClickedScrollBar) {
		    		hasClickedScrollBar = false;
		    		isTransitionModeAuto = true;
		    	}
		    });
		}

		function manageTransition(target) {
			//Transition automatique
			if(isTransitionModeAuto)
				screen.moveTo(target, 1000);

			//Transition manuel par scrolling :
			else {
				prevItem = currentItem;
				prevItem.fadeOut('slow');

				currentItem = pos[target];
				currentItem.fadeIn('slow');
				bar.managePosition();
			}			
		}

		function manageItems() {
			var i = currentItem.index();

			//Si on passe au suivant
			if( st > pos[i].bot && isScrollingDown) {
				if( i < pos.length-1) {
					//Changement de currentItem			
					while(i < pos.length-1 && pos[i].bot < st ) { i++;}

					manageTransition(i);		
				}
				else {
					screen.moveTo(i, 1000);
				}
			}
			//Si on passe au précédent
			else if ( st < pos[i].top && !isScrollingDown ) {
				//S'il existe un élément précédent
				if(i > 0) {
					//Changement de currentItem
					while(pos[i].top > st && i > 0) { i--; }

					manageTransition(i);
				}
			}
			//Si on arrive à la limite de l'image précédente, on la bloque en position fixed
			if(!pos[prevItem.index()].isTooSmall()) {
				if(! $(prevItem.img).hasClass('fixed-bottom') && 
					st + $(window).height() > prevItem.offset() + prevItem.height() 
					) {
					//console.log('scroll '+ (st + $(window).height() ) + ' bot : '+ (pos[prevItem.index()].bot + delta ) );
					prevItem.fixBottom();
				} 
				else if( ! $(prevItem.img).hasClass('fixed-top') && 
					st < prevItem.offset() ) {
					prevItem.fixTop();
				}
			}
		};

		function lockScroll() {
			isScrollLocked = true;
			//catch middle mouse click scrolling
		    $(document).bind('mousedown',disableMiddleMouseButtonScrolling);

		    //catch other kinds of scrolling
		    $(document).bind('mousewheel DOMMouseScroll wheel',disableNormalScroll);

		    //catch any other kind of scroll (though the event wont be canceled, the scrolling will be undone)
		    //IE8 needs this to be 'window'!
		    $(window).bind('scroll',disableNormalScroll);
		}

		function unlockScroll()
		{
			isScrollLocked = false;
			$(document).unbind('mousedown',disableMiddleMouseButtonScrolling);
	        $(document).unbind('mousewheel DOMMouseScroll wheel',disableNormalScroll);
	        $(window).unbind('scroll',disableNormalScroll);
		}

		function disableMiddleMouseButtonScrolling(e)
		{
		    if(e.which == 2)
		    {
		        e.preventDefault();
		    }
		    return false;
		}

		function disableNormalScroll(e)
		{
		    e.preventDefault();
		    $('html, body').scrollTop(oldScrollTop);
		    return false;
		}

		this.disableScrollBar = function () {
			$('html,body').css('overflow', 'hidden');
		}

		this.enableScrollBar = function () {
			$('html,body').css('overflow', 'auto');
		}

		this.fullScreenEnable = function () {
			if (fullScreenApi.supportsFullScreen) {
	    		fullScreenApi.requestFullScreen(document.documentElement);
	    		isFullScreen = true;
	    		buttonBar.fullScreenChangeEvent(true);
	    	}
	    	else console.log('Full Screen Not Supported');

		}

		this.fullScreenDisable = function () {
			if (fullScreenApi.supportsFullScreen) {
	    		fullScreenApi.cancelFullScreen(document.documentElement);
	    		isFullScreen = false;
	    	}
	    	else console.log('Full Screen Not Supported');
	    	buttonBar.fullScreenChangeEvent(false);
		}

		this.fullScreenToggle = function () {
			if(isFullScreen) {
				isFullScreen = false;
				screen.fullScreenDisable();
				
			}
			else {
				isFullScreen = true;
				screen.fullScreenEnable();
			}
		}

		this.manageResize = function () {
			if(isFullScreen != fullScreenApi.isFullScreen()) {
				isFullScreen = fullScreenApi.isFullScreen();
				buttonBar.fullScreenChangeEvent(fullScreenApi.isFullScreen());
			}
		}
	}










	function computeOffset() {

		$.each(pos, function(i) {
			var height = Math.round(this.height());
			var wh = $(window).height();			
			
			//Calcul limit bot :
			if(height - 2 * delta < wh) {
				this.isTooSmall ( true );
				if(i > 0) {
					this.offset( pos[i-1].bot  + wh / 2 - height / 2 + 1.3 * delta );
					this.bot  = this.offset() + height / 2 + 0.3 * delta - wh / 2 ;
				}	
				else {
					this.offset( wh / 2 - height / 2 );
					this.bot = this.offset() + height / 2 + 1 * delta - wh / 2 ;
					this.top = 0;
				}
			}
			else {
				this.isTooSmall( false );
				if(i > 0) {
					this.offset( pos[i-1].bot );
					this.bot = this.offset() + height - wh - delta;
				}
				else {
					this.offset( 0 );
					this.bot = this.offset() + height - delta - wh;
					this.top = 0;
				}
			}
			
			if(i > 0 ) {
				this.top = pos[i-1].bot + delta;
			}

			//console.log(i+ ' : bot : '+Math.round(this.bot)+', top : '+Math.round(this.top)+', offset : '+Math.round(this.offset())+", height : "+height);
			
		});

		$('body').height(pos[pos.length-1].offset() + pos[pos.length-1].height() );
		bar.managePosition();
	};





//Objet manageBar
	function manageBar() {
		var bar = $('.gallery-bar');
		var cursor = $('.gallery-bar-cursor');
		var leftCursorBar = parseInt(cursor.css('left'));
		var thumbnailWidth = parseInt( $('.gallery-bar-item').css('width') );

		this.manageClick = function() {
			$('li[class=gallery-bar-item]').click(function(e) {
				screen.moveTo($(e.delegateTarget).index());
				autoPlay.stop();
			})
		}

		function barWidth () {
			return pos.length * thumbnailWidth;
		}

		this.managePosition = function () {
			var index = currentItem.index();

			//console.log('bar '+width()+' window '+$(window).width());

			if(barWidth() <= $(window).width()) {
				//On centre la bar
				var margeLeft = ( $(window).width() - barWidth() ) /2;
				bar.css('left','auto');
				var placeLeft = margeLeft + leftCursorBar + index * thumbnailWidth;
				cursor.css('left', placeLeft+'px');
			}
			else {
				if(pos.length <= 1) return;

				var left = - (index / (pos.length - 1)) * (barWidth() - $(window).width());
				bar.css('left', left+'px');
				var placeLeft = left + leftCursorBar + index * thumbnailWidth;
				cursor.css('left', placeLeft+'px');
			}
		}
	}






	function manageButton () {
		var fullScreenButton = $('#gallery-fullscreen-button');
		var helpButton = $('#gallery-help-button');
		var helpArea = $('#gallery-help-area');

		$('#gallery-escape-button').click(function() {
			screen.fullScreenDisable();
		});

		helpButton.click(function() {
			$(helpArea).toggleClass('open');
			console.log('test');
		});

		$(window).click(function (e) {
			if($('#gallery-help-area:hover').length == 0 &&
				$('#gallery-help-button:hover').length == 0) {
				helpArea.removeClass('open');
			}
		});

		$('#gallery-play-button').click(function() {
			autoPlay.toggle();
		});

		this.autoPlayEvent = function (isPlaying) {
			if(isPlaying) {
				$('#gallery-play-button').addClass('active');
			}
			else {
				$('#gallery-play-button').removeClass('active');
			}
		}

		fullScreenButton.click(function() {
			screen.fullScreenToggle();
		});

		this.fullScreenChangeEvent = function (isFullScreen) {
			if(isFullScreen) {
				fullScreenButton.addClass('active');
			}
			else 
				fullScreenButton.removeClass('active');
		};
	};


//Gestion de la lecture automatique
	
	function autoPlayFunc () {
		var isPlaying = false;
		var intervalLecture;

		this.play = function () {
			isPlaying = true;
			screen.disableScrollBar();
			buttonBar.autoPlayEvent(isPlaying);

			intervalLecture = setInterval(function() {
				if(currentItem.index() == pos.length-1) {
					//Fin de lecture
					autoPlay.stop();
					return;
				}

				var target = (currentItem.index() + 1)%pos.length;
				
				screen.moveTo(target);
				console.log('is Playing')
		    	isPlaying = true;
		    	return false;
		    }, diaporamaTime);
		}

		this.stop = function () {
			isPlaying = false;
			clearTimeout(intervalLecture);
			screen.enableScrollBar();
			buttonBar.autoPlayEvent(isPlaying);
		}

		this.toggle = function () {
			if(isPlaying) {
				autoPlay.stop();
			}
			else 
				autoPlay.play();
		}
	}

	var bar = new manageBar();
	var screen = new screenFunc();
	var autoPlay = new autoPlayFunc();
	var buttonBar = new manageButton();
	

	$(window).load(function() {
		initialize();
		computeImageSize();
		currentItem = pos.first();
		if(pos.length > 1) prevItem = pos[1];	//A check pour pas que ça bug
		computeOffset();
		screen.manageScroll();
		bar.managePosition();
		bar.manageClick();
		screen.manageScrollBar();
	});
	//Permet de recalculer les images avec les bonnes dimensions
	$(window).on('resize', function() {
		computeOffset();
		bar.managePosition();
		screen.manageResize();
		});
	$(window).on('scroll touchmove mousewheel', function(e) {
		screen.manageScroll(e);
		//return false;
	});
	$(window).keydown(screen.manageKey);


	

} )(jQuery);











//Gestion de l'apparition d'un bloc.
//Si on clique sur le bloc, il apparaît
//Si on passe la sourie 0.2s sur la zone, on fait apparaître le bloc
//Si on sort la sourie plus de 0.8s de la zone, on fait disparaître le bloc
//Si on clique hors du bloc, il disparaît
//Si le focus est à l'intérieur, il reste ouvert

(function($) {
	var enterTime = 150;
	var leaveTime = 400;

	function areaManager (t, classN) {
		var opened = false;
		var isIn = false;
		var className = classN;
		var target = t;

		//Si on clique en dehors
		$(window).click(function() {
			if(isIn)
				open();
			else 
				close();
		})

		this.setClass = function (c) {
			className = c;
		}

		function open () {
			if(isIn) {
				target.addClass(className);
				opened = true;
			}
		}

		function close () {
			if(!isIn) {
				opened = false;
				target.removeClass(className);
			}
		}

	  	this.hover = function (e) {
			if(e.type === 'mouseenter') {
				if(!opened)
					setTimeout(open, enterTime);
				isIn = true;
			} 
			else {
				if(opened && target.find(":focus").length == 0 ) 
					setTimeout(close, leaveTime);
				isIn = false;
			}
		}
	}
/*
	var obj = new foo($('.gallery-arrow'));
	obj.setClass('gallery-arrow-shoot');
	$('.gallery-meta-box').hover(obj.myHover);
*/
	var metaArea = new areaManager($('.gallery-meta-area'), 'gallery-meta-area-open');
	$('.gallery-meta-area').hover(metaArea.hover);

	var barArea = new areaManager($('.gallery-bar-area'), 'gallery-bar-area-open');
	$('.gallery-bar-area').hover(barArea.hover);

}) (jQuery);