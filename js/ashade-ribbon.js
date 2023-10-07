/** 
 * Author: Shadow Themes
 * Author URL: http://shadow-themes.com
 */
"use strict";
var ashade_ribbon = {};

ashade_ribbon = {
	$el: jQuery('.ashade-albums-carousel'),
	type: 'large',
	target: 0,
	current: 0,
	isDown: false,
	isDownLink: false,
	isLinkMoved: false,
	isTouch: false,
	isLocked: false,
	mozDelta: 33,
	currentStep: 0,
	maxStep: jQuery(window).width(),
	
	// Scroll Speed Option for Touch Devices
	touchSpeed: {
		vertical: 2, // Speed factor for Vertical Ribbon
		horizontal: 2, // Speed factor for Horizontal Ribbon
	},
	
	tagetChanged: function() {
		if (ashade_ribbon.type == 'medium') {
			let percent = Math.ceil(ashade_ribbon.currentStep * 100 / (ashade_ribbon.maxStep));
			ashade_ribbon.barTarget = ashade_ribbon.$bar.width() * (percent/100);
		}
		if (ashade_ribbon.type == 'vertical') {
			if (ashade_ribbon.target > $ashade_window.height()/2) {
				$ashade_body.addClass('has-to-top');
			} else {
				$ashade_body.removeClass('has-to-top');
			}
		}
	},

	init: function() {
		/* Determine Type */
		/* -------------- */
		if (ashade_ribbon.$el.hasClass('is-medium')) {
			ashade_ribbon.$bar = ashade_ribbon.$el.parent().children('.ashade-albums-carousel-progress');
			ashade_ribbon.barTarget = 0;
			ashade_ribbon.barCurrent = 0;
			ashade_ribbon.type = 'medium';
		}		
		if (ashade_ribbon.$el.hasClass('is-vertical')) {
			ashade_ribbon.type = 'vertical';
		}

		/* Move Functions */
		/* -------------- */
		// Mouse Events
		ashade_ribbon.$el.on('mousedown', function(e) {
			if (ashade_ribbon.isTouch) {
				ashade_ribbon.isTouch = false;
			}
			if (!ashade_ribbon.$el.hasClass('is-hovered')) {
				e.preventDefault();
				ashade_ribbon.isDown = true;
				ashade_ribbon.$el.addClass('is-grabbed');
				if (ashade_ribbon.type == 'vertical') {
					ashade_ribbon.old_pageX = e.clientY;
				} else {
					ashade_ribbon.old_pageX = e.clientX;
				}
			}
		}).on('mouseup', function() {
			ashade_ribbon.isDown = false;
			ashade_ribbon.$el.removeClass('is-grabbed');
			ashade_ribbon.isDownLink = false;
		}).on('mouseleave', function() {
			ashade_ribbon.isDown = false;
			ashade_ribbon.$el.removeClass('is-grabbed');
			ashade_ribbon.isDownLink = false;
		}).on('mousemove', function(e) {
			e.preventDefault();
			if (ashade_ribbon.isDown) {
				if (ashade_ribbon.type == 'vertical') {
					let newX = (ashade_ribbon.old_pageX - e.clientY)*2,
						newTop = ashade_ribbon.currentStep + newX;
					ashade_ribbon.old_pageX = e.clientY;
					if (newTop > ashade_ribbon.maxStep) {
						newTop = ashade_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					ashade_ribbon.currentStep = newTop;
					ashade_ribbon.target = newTop;
				} else {
					let newX = ashade_ribbon.old_pageX - e.clientX,
						newTop = ashade_ribbon.currentStep + newX;
					ashade_ribbon.old_pageX = e.clientX;
					if (newTop > ashade_ribbon.maxStep) {
						newTop = ashade_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					ashade_ribbon.currentStep = newTop;
					ashade_ribbon.target = newTop;
				}
				ashade_ribbon.tagetChanged();
			}
			if (ashade_ribbon.isDownLink) {
				ashade_ribbon.isLinkMoved = true;
			} else {
				ashade_ribbon.isLinkMoved = false;
			}
		});
		
		ashade_ribbon.$el[0].addEventListener('wheel', function(e) {
			var this_delta = e.deltaY;
			if (e.mozInputSource) {
				this_delta = e.deltaY * ashade_ribbon.mozDelta;
			}
			let newTop = ashade_ribbon.currentStep + this_delta;
			if (newTop > ashade_ribbon.maxStep) {
				newTop = ashade_ribbon.maxStep;
			}
			if (newTop < 0) {
				newTop = 0;
			}
			ashade_ribbon.currentStep = newTop;
			ashade_ribbon.target = newTop;
			ashade_ribbon.tagetChanged();
		});
		
		// Touch Events
		ashade_ribbon.$el[0].addEventListener('touchstart', function(e) {
			if (!ashade_ribbon.isTouch) {
				ashade_ribbon.isTouch = true;
			}
			ashade_ribbon.isDown = true;
			ashade_ribbon.$el.addClass('is-grabbed');
			if (ashade_ribbon.type == 'vertical') {
				ashade_ribbon.old_pageX = e.touches[0].clientY;
			} else {
				ashade_ribbon.old_pageX = e.touches[0].clientX;
			}
		}, false);
		ashade_ribbon.$el[0].addEventListener('touchmove', function(e) {
			if (ashade_ribbon.isDown) {
				if (ashade_ribbon.type == 'vertical') {
					let newX = (ashade_ribbon.old_pageX - e.touches[0].clientY)*ashade_ribbon.touchSpeed.vertical,
						newTop = ashade_ribbon.currentStep + newX;
					ashade_ribbon.old_pageX = e.touches[0].clientY;
					if (newTop > ashade_ribbon.maxStep) {
						newTop = ashade_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					ashade_ribbon.currentStep = newTop;
					ashade_ribbon.target = newTop;
				} else {
					let newX = (ashade_ribbon.old_pageX - e.touches[0].clientX)*ashade_ribbon.touchSpeed.horizontal,
						newTop = ashade_ribbon.currentStep + newX;
					
					ashade_ribbon.old_pageX = e.touches[0].clientX;
					if (newTop > ashade_ribbon.maxStep) {
						newTop = ashade_ribbon.maxStep;
					}
					if (newTop < 0) {
						newTop = 0;
					}
					ashade_ribbon.currentStep = newTop;
					ashade_ribbon.target = newTop;
				}
				ashade_ribbon.tagetChanged();
			}
			if (ashade_ribbon.isDownLink) {
				ashade_ribbon.isLinkMoved = true;
			} else {
				ashade_ribbon.isLinkMoved = false;
			}			
		}, false);
		ashade_ribbon.$el[0].addEventListener('touchend', function(e) {
			ashade_ribbon.isDown = false;
			ashade_ribbon.$el.removeClass('is-grabbed');
			ashade_ribbon.isDownLink = false;
		}, false);

		// Links and Buttons
		ashade_ribbon.$el.find('a.ashade-button').on('mouseover', function() {
			if (!ashade_ribbon.isTouch) {
				ashade_ribbon.$el.addClass('is-hovered');
			}
		}).on('mouseout', function(){
			ashade_ribbon.$el.removeClass('is-hovered');
		});
		
		ashade_ribbon.$el.find('a').on('mousedown', function() {
			ashade_ribbon.isDownLink = true;
		}).on('click', function(e) {
			if (ashade_ribbon.isLinkMoved) {
				e.preventDefault();
				return false;
			}
			ashade_ribbon.isDownLink = false;
			ashade_ribbon.isLinkMoved = false;
		});
		
		ashade_ribbon.$el.find('.ashade-album-item').each(function() {
			if ('IntersectionObserver' in window) {
				ashade_ribbon.observer.observe(this);
			} else {
				jQuery(this).children('.ashade-album-item__inner').addClass('is-inview');
			}
		});

		// Layout
		ashade_ribbon.layout();

		// Start Animation
		ashade_ribbon.animate();
		
		// Bind Window Actions
		jQuery(window).on('resize', function() {
			// Window Resize Actions
			ashade_ribbon.layout();
			setTimeout(ashade_ribbon.layout(), 500);
		}).on('load', function() {
			// Window Load Actions
			ashade_ribbon.layout();
		});
	},
	layout: function() {
		$ashade_body.height($ashade_window.height());
		
		let $this = ashade_ribbon.$el,
			fullWidth = 0,
			setHeight;

		if (ashade_ribbon.type == 'large') {
			setHeight = $ashade_window.height() - $ashade_header.height() - $ashade_footer.height();
			$this.css('top', $ashade_header.height());
		}
		if (ashade_ribbon.type == 'medium') {
			setHeight = $ashade_window.height()/2;
		}

		if (ashade_ribbon.type == 'large' || ashade_ribbon.type == 'medium') {
			$this.height(setHeight).find('.ashade-album-item__title').width(setHeight);
			$this.find('.ashade-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img');

				if ($this_slide_img.attr('height') && $this_slide_img.attr('width')) {
					$this_slide.height(setHeight);
					let imgRatio = parseInt($this_slide_img.attr('width'), 10)/parseInt($this_slide_img.attr('height'), 10),
						setWidth = setHeight*imgRatio;

					$this_slide_img.height(setHeight).width(setWidth);
					fullWidth = fullWidth + $this_slide.width();
				} else {
					$this_slide.height(setHeight);
				}
			});
		}

		if (ashade_ribbon.type == 'vertical') {
			$this.find('.ashade-album-item').each(function() {
				let $this_slide = jQuery(this),
					$this_slide_img = $this_slide.find('img'),
					setHeight = $this_slide_img.height();

				$this_slide.find('.ashade-album-item__title').width(setHeight);

				fullWidth = fullWidth + $this_slide.height();
			});
			fullWidth = fullWidth + $ashade_header.height() + $ashade_footer.height();
			$this.css('padding', $ashade_header.height()+'px 0 ' + $ashade_footer.height() + 'px 0')
			$this.height(fullWidth);
		} else {
			$this.width(fullWidth);
		}

		if (ashade_ribbon.type == 'vertical') {
			let body_height = fullWidth;
			ashade_ribbon.maxStep = body_height - $ashade_window.height();
		} else {
			let spacingLeft = parseInt($this.find('.ashade-album-item__inner').css('margin-right'), 10),
				body_height = fullWidth - $ashade_window.width() + spacingLeft + $ashade_window.height();
			$this.css('padding-left', spacingLeft + 'px');
			ashade_ribbon.maxStep = body_height - $ashade_window.height();
		}
		
		if (ashade_ribbon.currentStep > ashade_ribbon.maxStep) {
			ashade_ribbon.currentStep = ashade_ribbon.maxStep;
			ashade_ribbon.target = ashade_ribbon.currentStep;
		}
		if (ashade_ribbon.currentStep < 0) {
			ashade_ribbon.currentStep = 0;
			ashade_ribbon.target = ashade_ribbon.currentStep;
		}
	},
	animate: function() {
		if (ashade_ribbon.type == 'vertical') {
			// Scroll Content
			ashade_ribbon.current += ((ashade_ribbon.target - ashade_ribbon.current) * 0.1);
			ashade_ribbon.$el.css('transform', 'translate3d(0, -'+ ashade_ribbon.current +'px, 0)');
			// Img Motion Effect
			let img_current = (ashade_ribbon.target - ashade_ribbon.current) * 0.1;
			ashade_ribbon.$el.find('.ashade-album-item__overlay').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
			ashade_ribbon.$el.find('img').css('transform', 'translate3d(0, '+ img_current +'px, 0)');
		} else {
			// Scroll Content
			ashade_ribbon.current += ((ashade_ribbon.target - ashade_ribbon.current) * 0.1);
			ashade_ribbon.$el.css('transform', 'translate3d(-'+ ashade_ribbon.current +'px, 0, 0)');
			// Img Motion Effect
			let img_current = (ashade_ribbon.target - ashade_ribbon.current) * 0.1;
			ashade_ribbon.$el.find('.ashade-album-item__overlay').css('transform', 'translate3d('+ img_current +'px, 0, 0)');
			ashade_ribbon.$el.find('img').css('transform', 'translate3d('+ img_current +'px, 0, 0)');			
			// Bar Update
			if (ashade_ribbon.type == 'medium') {
				ashade_ribbon.barCurrent += ((ashade_ribbon.barTarget - ashade_ribbon.barCurrent) * 0.1);
				ashade_ribbon.$bar.children('.ashade-albums-carousel-progress__bar').width(ashade_ribbon.barCurrent);
			}			
		}
		// Update Frame
		requestAnimationFrame( ashade_ribbon.animate );
	}
};
if ('IntersectionObserver' in window) {
	ashade_ribbon.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting) {
				jQuery(entry.target).children('.ashade-album-item__inner').addClass('is-inview');
			} else {
				jQuery(entry.target).children('.ashade-album-item__inner').removeClass('is-inview');
			}
		});
	});
}

// Init when Document is ready
jQuery(document).ready( function() {
	ashade_ribbon.init();
});