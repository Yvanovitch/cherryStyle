







/*
Envoie des commentaires via "Enter"
*/
( function ($) {
	$(':input').keypress(function (e) {
  		if (e.which == 13) {
  			$(this).closest("form").submit();
	    	//this.closest("form").submit();
	    	//return false;
	  	}
	});
}) ( jQuery );



/*
Gère l'affichage des commentaires trop long lors du clique sur "..."
*/

(function ($) {
	$('.comment-more-button').click(function (e) {
		$(this).parent().children('.comment-more-content').removeClass('comment-more-content');
		$(this).css('display','none');
		e.preventDefault();
		return false;
	});
}) (jQuery);



(function ($) {

jQuery.fn.timedAddClass = function (className, mustHide, duration) {
	var elem = $(this);
	if(typeof className === 'undefined') className = 'open';

	elem.css('display','block');
	setTimeout(animate, 10);

	function animate () {
		elem.addClass(className);
	}
}

jQuery.fn.timedRemoveClass = function (className, mustHide, duration) {
	var elem = $(this);
	if(typeof className === 'undefined') className = 'open';
	if(typeof duration === 'undefined')	{
		if(typeof this.css('transition-duration') !== 'undefined') 
			duration = transitionDurationToMilliseconds(this.css('transition-duration'));
		else
			duration = 0;
	}

	if(elem.hasClass(className)) {
		elem.removeClass(className);
		if(duration > 0) {
			setTimeout(hide, duration);
		}
		else
			hide();
	}

	function hide () {
		if(mustHide)
			elem.css('display', 'none');
	}
}

jQuery.fn.timedToggleClass = function (className, mustHide, duration) {
	var elem = $(this);
	if(typeof className === 'undefined') className = 'open';
	if(typeof duration === 'undefined')	{
		if(typeof this.css('transition-duration') !== 'undefined') 
			duration = transitionDurationToMilliseconds(this.css('transition-duration'));
		else
			duration = 0;
	}

	if(elem.hasClass(className)) {
		elem.timedRemoveClass(className, mustHide, duration);
	}
	else {
		elem.timedAddClass(className, mustHide, duration);
	}
}

jQuery.fn.isHidden = function () {
	return ($(this).css('display') === 'none');
}

}) (jQuery);

var transitionDurationToMilliseconds = function(duration) {
	var pieces = duration.match(/^([\d\.]+)(\w+)$/),
	time, unit, multiplier;
	 
	if (pieces.length <= 1) {
	return duration;
	}
	 
	time = pieces[1];
	unit = pieces[2];
	 
	switch(unit) {
	case 'ms': multiplier = 1; break;
	case 's': multiplier = 1000; break;
	}
	 
	return time * multiplier;
};



//Gestion de l'apparition d'un bloc.
//Si on clique sur le bloc, il apparaît
//Si on passe la sourie 0.2s sur la zone, on fait apparaître le bloc
//Si on sort la sourie plus de 0.8s de la zone, on fait disparaître le bloc
//Si on clique hors du bloc, il disparaît
//Si le focus est à l'intérieur, il reste ouvert

(function($) {
	var enterTime = 150;
	var leaveTime = 400;

	function areaManager (target, className) {
		var opened = false;
		var isIn = false;
		var areas = [];
		var mustHide = false;
		areas[0] = target;

		if(typeof className === 'undefined')
			className = 'open';

		this.setMustHide = function (val) {
			mustHide = val;
		}

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
				target.timedAddClass(className, mustHide);
				opened = true;
			}
		}
		this.open = open;

		function close () {
			if(!isIn) {
				opened = false;
				target.timedRemoveClass(className, mustHide);
			}
		}
		this.close = close;

	  	$(target).hover(function (e) {
			if(e.type === 'mouseenter') {
				if(!opened)
					setTimeout(open, enterTime);
				isIn = true;
			} 
			else {
				if(opened && !hasFocus()) 
					setTimeout(close, leaveTime);
				isIn = false;
			}
		});

		this.addArea = function (elem, eventType) {
			areas[areas.length] = elem;

			$(elem).hover(function (e) {
				if(e.type === 'mouseenter') {
					if(!opened && eventType == 'hover')
						setTimeout(open, enterTime);
					isIn = true;
				} 
				else {
					if(opened && !hasFocus() ) 
						setTimeout(close, leaveTime);
					isIn = false;
				}
			});

			if(eventType == 'hover') return;

			$(elem).on(eventType, function () {
				open();
			})
		}

		function hasFocus () {
			var focus = false;
			$.each(areas, function () {
				if($(this).find(':focus').length > 0) focus = true;
			});
			return focus;
		}
	}

	var metaArea = new areaManager($('.gallery-meta-area'));

	var barArea = new areaManager($('.gallery-bar-area'));

	var infoArea = new areaManager($('.comment-form-information'));
	infoArea.setMustHide(true);
	infoArea.addArea($('.comment-form'), 'click');

	/*Pour comment-form-information, on veut :
	Ouverture au clique sur #comment
	Fermeture si la souris sort du bloc si aucun :focus, ni dans information, ni dans #comment
	*/

	$(window).click(function (e) {

	});
}) (jQuery);



/*
Gestion de l'apparition de l'interface façon ARIA
En cours de réflexion
*/
/*
(function ($) {

	$('.collapsible h3').each(function() {
	  
	  var $this = $(this);

	  // create unique id for a11y relationship
	  
	  var id = 'collapsible-' + $this.index();

	  // wrap the content and make it focusable

	  $this.nextUntil('h3').wrapAll('<div id="'+ id +'" aria-hidden="true">');
	  var panel = $this.next();

	  // Add the button inside the <h2> so both the heading and button semanics are read
	  
	  $this.wrapInner('<button aria-expanded="false" aria-controls="'+ id +'">');
	  var button = $this.children('button');

	  // Toggle the state properties
	  
	  button.on('click', function() {
	    var state = $(this).attr('aria-expanded') === 'false' ? true : false;
	    $(this).attr('aria-expanded', state);
	    panel.attr('aria-hidden', !state);
	  });

	});
}) (jQuery);
*/

/*
Gestion automatique des textes intérieurs aux inputs et textarea
Utilise l'attribue data-value pour cela
-> Remplacé par placeHolder
*/
/*
( function ($) {
	var fuelInputs = function() {
		$(':input[type!="hidden"]').each(function(){
			var reset = function() {
		    	if(input.val() == value && input.attr('type') != "submit") {
		    		input.val('');
		    	} 
		    	return true;
		    }

		    var submitCheck = function() {
		    	console.log('tset');
		    	//Cas des champs non-obligatoire
		    	if(!input.prop('required')) {
		    		if(input.val() == value) {
		    			input.val('');
		    		}
		    		return true;
		    	}

		      	if ( ! input.val() ) { return false; }
		    	if(input.val() == value && input.attr('type') != 'submit') {
		    		return false;
		    	} 
		    	return true;
		    }

		    var value = $(this).attr('data-help');
		    var input = $(this);

		    $(this).click(reset);
		    $(this).focus(reset);
		    $(this).closest("form").submit(submitCheck);
		    
		    $(this).blur(function() {
		    	if(this.value == '') {
		    		this.value = value;
		    	}
		    });		    
		});
	}
	$(window).load(fuelInputs);

} )( jQuery);
*/