
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