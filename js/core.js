/** 
 * Author: Shadow Themes
 * Author URL: http://shadow-themes.com
 */
"use strict";

var ashade = {
		flocker: {
			field_changed:	 false,
			field_interract: false,
			form_interract:  false
		}
	},
    $ashade_html = jQuery('html'),
	ashade_tns = [],
    $ashade_body = jQuery('body'),
    $ashade_window = jQuery(window),
    $ashade_header = jQuery('header#ashade-header'),
    $ashade_footer = jQuery('footer#ashade-footer'),
	$ashade_main = jQuery('main.ashade-content-wrap'),
	$ashade_scroll = jQuery('.ashade-content-scroll'),
	$ashade_header_holder;

// Default Options
ashade.config = {
    'smooth_ease' : 0.1,
	'content_load_delay': 0.8
}

class Ashade_Before_After {
	constructor($obj) {
		if ($obj instanceof jQuery) {
			let this_class = this;
			this.$el = {
				$wrap: $obj,
				$before : jQuery('<div class="ashade-before-after-img ashade-before-img"/>').appendTo($obj),
				$after : jQuery('<div class="ashade-before-after-img ashade-after-img"/>').appendTo($obj),
				$divider : jQuery('<div class="ashade-before-after-divider"><i class="la la-arrows-h"></i></div>').appendTo($obj),
			};
			this.offset = this.$el.$wrap.offset().left;
			this.size = this.$el.$wrap.width();
			this.current = 50;
			this.target = 50;
			this.isDown = false;
			
			this.$el.$before.css('background-image', 'url('+ this.$el.$wrap.data('img-before') +')');
			this.$el.$after.css('background-image', 'url('+ this.$el.$wrap.data('img-after') +')');
			
			// Mouse Events
			this.$el.$wrap.on('mousedown', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}).on('mousemove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.pageX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}
			}).on('mouseleave', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}).on('mouseup', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			});
			
			// Touch Events
			this.$el.$wrap[0].addEventListener('touchstart', function(e) {
				e.preventDefault();
				this_class.isDown = true;
			}, false);
			this.$el.$wrap[0].addEventListener('touchmove', function(e) {
				e.preventDefault();
				if (this_class.isDown) {
					let position = e.touches[0].clientX - this_class.offset,
						newTarget = position/this_class.size;
					if (newTarget > 1)
						newTarget = 1;
					if (newTarget < 0)
						newTarget = 0;
					this_class.target = newTarget * 100;
				}				
			}, false);
			this.$el.$wrap[0].addEventListener('touchend', function(e) {
				e.preventDefault();
				this_class.isDown = false;
			}, false);
			
			// Window Events
			$ashade_window.on('resize', function() {
				this_class.layout();
				this_class.reset();
			}).on('load', function() {
				this_class.layout();
			});

			// Layout
			this.layout();

			// Run Animation
			this.requestAnimation();
		} else {
			return false;
		}
	}
	
	layout() {
		this.offset = this.$el.$wrap.offset().left;
		this.size = this.$el.$wrap.width();
	}
	reset() {
		this.current = 50;
		this.target = 50;
	}
	requestAnimation() {
		this.animation = requestAnimationFrame(() => this.animate());
	}
	animate() {
		this.current += ((this.target - this.current) * 0.1);
		this.$el.$after.css('width', parseFloat(this.current).toFixed(1) +'%');
		this.$el.$divider.css('left', parseFloat(this.current).toFixed(1) +'%');
		this.requestAnimation();
	}
}

// Magic Cursor
ashade.cursor = {
	$el : jQuery('.ashade-cursor'),
	$el_main : jQuery('span.ashade-cursor-circle'),
	targetX: $ashade_window.width()/2,
	targetY: $ashade_window.height()/2,
	currentX: $ashade_window.width()/2,
	currentY: $ashade_window.height()/2,
	easing: 0.2,
	init : function() {
		let $this_el = this.$el;
		// Cursor Move
		$ashade_window.on('mousemove', function(e) {
			ashade.cursor.targetX = e.clientX - $this_el.width()/2;
			ashade.cursor.targetY = e.clientY - $this_el.height()/2;
        });
		if ($this_el.length) {
			ashade.cursor.animate();
		}
		
		// Show and Hide Cursor
        $ashade_window.on('mouseleave', function() {
			ashade.cursor.$el.addClass('is-inactive');
        }).on('mouseenter', function() {
			ashade.cursor.$el.removeClass('is-inactive');
        });
		
		// Bind Interractions
		jQuery(document).on('mouseenter', 'a', function() {
			if (jQuery(this).hasClass('ashade-lightbox-link')) {
				ashade.cursor.$el.addClass('int-lightbox');
			} else {
				ashade.cursor.$el.addClass('int-link');
			}
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-link int-lightbox');
			});			
		}).on('mouseenter', 'button', function() {
			ashade.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', 'input[type="submit"]', function() {
			ashade.cursor.$el.addClass('int-link');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-link');
			});
		}).on('mouseenter', '.ashade-back', function() {
			jQuery('.ashade-back').on('mouseenter', function() {
				ashade.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					ashade.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.is-link', function() {
			jQuery('.is-link').on('mouseenter', function() {
				ashade.cursor.$el.addClass('int-link');
				jQuery(this).on('mouseleave', function() {
					ashade.cursor.$el.removeClass('int-link');
				});
			});
		}).on('mouseenter', '.ashade-aside-overlay', function() {
			ashade.cursor.$el.addClass('int-close');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-close');
			});
		}).on('mouseenter', '.ashade-before-after', function() {
			ashade.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.ashade-testimonials-carousel .tns-ovh', function() {
			ashade.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.ashade-albums-slider', function() {
			ashade.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.pswp__scroll-wrap', function() {
			ashade.cursor.$el.addClass('int-grab-h');
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-grab-h');
			});
		}).on('mouseenter', '.ashade-albums-carousel', function() {
			if (jQuery(this).hasClass('is-vertical')) {
				ashade.cursor.$el.addClass('int-grab-v');
			} else {
				ashade.cursor.$el.addClass('int-grab-h');
			}
			jQuery(this).on('mouseleave', function() {
				ashade.cursor.$el.removeClass('int-grab-h int-grab-v');
			});
		});
	},
	animate: function() {
		let $this_el = ashade.cursor.$el;
		ashade.cursor.currentX += ((ashade.cursor.targetX - ashade.cursor.currentX) * ashade.cursor.easing);
		ashade.cursor.currentY += ((ashade.cursor.targetY - ashade.cursor.currentY) * ashade.cursor.easing);
		$this_el.css('transform', 'translate3d('+ ashade.cursor.currentX +'px, '+ ashade.cursor.currentY +'px, 0)');
		requestAnimationFrame( ashade.cursor.animate );
	}
};
ashade.cursor.init();

// Lightbox
if ( jQuery('.ashade-lightbox-link').length ) {
	ashade.pswp = {
		gallery : Array(),
		html : jQuery('\
		<!-- Root element of PhotoSwipe. Must have class pswp. -->\
		<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
			<div class="pswp__bg"></div><!-- PSWP Background -->\
			\
			<div class="pswp__scroll-wrap">\
				<div class="pswp__container">\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
					<div class="pswp__item"></div>\
				</div><!-- .pswp__container -->\
				\
				<div class="pswp__ui pswp__ui--hidden">\
					<div class="pswp__top-bar">\
						<!--  Controls are self-explanatory. Order can be changed. -->\
						<div class="pswp__counter"></div>\
						\
						<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
						\
						<div class="pswp__preloader">\
							<div class="pswp__preloader__icn">\
							  <div class="pswp__preloader__cut">\
								<div class="pswp__preloader__donut"></div>\
							  </div><!-- .pswp__preloader__cut -->\
							</div><!-- .pswp__preloader__icn -->\
						</div><!-- .pswp__preloader -->\
					</div><!-- .pswp__top-bar -->\
					\
					<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
						<div class="pswp__share-tooltip"></div>\
					</div><!-- .pswp__share-modal -->\
					\
					<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
					<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
					\
					<div class="pswp__caption">\
						<div class="pswp__caption__center"></div>\
					</div><!-- .pswp__caption -->\
				</div><!-- .pswp__ui pswp__ui--hidden -->\
			</div><!-- .pswp__scroll-wrap -->\
		</div><!-- .pswp -->').appendTo($ashade_body)
	};
}

// Ashade Kenburns
if (jQuery('.ashade-kenburns-slider').length) {
	ashade.kenburns = {
		init: function() {
			// Set Variables
			let this_f = this;
			this_f.$el = jQuery('.ashade-kenburns-slider');
			this_f.items = this_f.$el.find('.ashade-kenburns-slide').length;
			this_f.transition = parseInt(this_f.$el.data('transition'),10);
			this_f.delay = parseInt(this_f.$el.data('delay'), 10)/1000 + this_f.transition*0.001;
			this_f.zoom = this_f.$el.data('zoom');
			this_f.from = this_f.zoom;
			this_f.to = 1;
			this_f.active = 0;

			// Setup Items
			let prev_offset_x = 0,
				prev_offset_y = 0;

			this_f.$el.find('.ashade-kenburns-slide').each(function() {
				let offset_x = Math.random() * 100,
					offset_y = Math.random() * 100;

				if (prev_offset_x > 50 && offset_x > 50) {
					offset_x = offset_x - 50;
				} else if (prev_offset_x < 50 && offset_x < 50) {
					offset_x = offset_x + 50;
				}
				if (prev_offset_y > 50 && offset_y > 50) {
					offset_y = offset_y - 50;
				} else if (prev_offset_y < 50 && offset_y < 50) {
					offset_y = offset_y + 50;
				}

				prev_offset_x = offset_x;
				prev_offset_y = offset_y;				

				jQuery(this).css({
					'transition' : 'opacity ' + this_f.transition + 'ms',
					'transform-origin' : offset_x + '% ' + offset_y + '%',
					'background-image' : 'url('+ jQuery(this).data('src')+')'
				});
			});

			// Run Slider
			ashade.kenburns.change();
		},
		change: function() {
			let this_f = this,
				scale_from = this_f.from,
				scale_to = this_f.to;

			// Loop
			if (this_f.active >= this_f.items) {
				this_f.active = 0;
			}
			let current_slide = this_f.$el.find('.ashade-kenburns-slide').eq(this_f.active);

			gsap.fromTo(current_slide, {
				scale: scale_from,
				onStart: function() {
					current_slide.addClass('is-active');
				}
			},
			{
				scale: scale_to,
				duration: this_f.delay,
				ease: 'none',
				onComplete: function() {
					ashade.kenburns.active++;
					ashade.kenburns.from = scale_to;
					ashade.kenburns.to = scale_from;
					ashade.kenburns.change();
					ashade.kenburns.$el.find('.is-active').removeClass('is-active');
				}
			});
		}
	};	
}

// Counter
ashade.counter = function( this_el ) {
	jQuery(this_el).prop('Counter', 0).animate({
		Counter: jQuery(this_el).text()
	}, {
		duration: parseInt(jQuery(this_el).parent().data('delay'), 10),
		easing: 'swing',
		step: function (now) {
			jQuery(this_el).text(Math.ceil(now));
		}
	});
}

// Circle Progress Bar
ashade.progress = {
	init: function(this_el) {
		let $this = jQuery(this_el),
			$bar_wrap = jQuery('<div class="ashade-progress-item-wrap"/>')
						.prependTo($this),
			this_size = this.getSize(this_el),
			$bar_svg = jQuery('\
				<svg width="'+ this_size.svgSize +'" height="'+ this_size.svgSize +'" viewPort="0 0 '+ this_size.barSize +' '+ this_size.barSize +'" version="1.1" xmlns="http://www.w3.org/2000/svg">\
					<circle class="ashade-progress-circle--bg" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="0"></circle>\
					<circle class="ashade-progress-circle--bar" transform="rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')" r="'+ this_size.r +'" cx="'+ this_size.barSize +'" cy="'+ this_size.barSize +'" fill="transparent" stroke-dasharray="'+ this_size.dashArray +'" stroke-dashoffset="'+ this_size.dashArray +'"></circle>\
				</svg>').appendTo($bar_wrap);
			$bar_svg.find('.ashade-progress-circle--bar').css('transition', 'stroke-dashoffset ' + $this.data('delay')+'ms ease-in-out');
			$bar_wrap.append('<span class="ashade-progress-counter">' + $this.data('percent') + '</span>');
		
		$ashade_window.on('resize', this.layout(this_el));
	},
	layout: function(this_el) {
		let $this = jQuery(this_el);
		if ($this.find('svg').length) {
			let this_size = this.getSize(this_el),
				$svg = $this.find('svg'),
				$barBg = $this.find('.ashade-progress-circle--bg'),
				$bar = $this.find('.ashade-progress-circle--bar');
			$svg.attr('width', this_size.svgSize)
				.attr('height', this_size.svgSize)
				.attr('viewPort', '0 0 '+ this_size.barSize +' '+ this_size.barSize);
			$barBg.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			});
			$bar.css({
				'r' : this_size.r,
				'cx' : this_size.barSize,
				'cy' : this_size.barSize,
				'stroke-dasharray': this_size.dashArray,
			}).attr('transform', 'rotate(-90, '+ this_size.barSize +', '+ this_size.barSize +')');
			if ($this.hasClass('is-done')) {
				
			} else {
				$bar.css('stroke-dashoffset', this_size.dashArray);
			}
		}
	},
	getSize: function(this_el) {
		let $this = jQuery(this_el),
			$wrap = $this.find('.ashade-progress-item-wrap'),
			sizes = {
				percent: parseInt($this.data('percent'), 10),
				svgSize: $wrap.width(),
				stroke: parseInt($wrap.css('stroke-width'), 10),
			}
			sizes.barSize = Math.floor(sizes.svgSize/2);
			sizes.r = sizes.barSize - sizes.stroke;
			sizes.dashArray = parseFloat(Math.PI*(sizes.r*2)).toFixed(2);
			sizes.dashOffset = parseFloat(sizes.dashArray - (sizes.dashArray*sizes.percent)/100).toFixed(2);

		return sizes;
	},
	animate: function(this_el) {
		let $this = jQuery(this_el),
			$this_counter = $this.find('span.ashade-progress-counter'),
			this_size = this.getSize(this_el),
			$bar = $this.find('.ashade-progress-circle--bar');
		$bar.css('stroke-dashoffset', this_size.dashOffset);
		$this_counter.prop('Counter', 0).animate({
			Counter: $this_counter.text()
		}, {
			duration: parseInt($this_counter.parents('.ashade-progress-item').data('delay'), 10),
			easing: 'swing',
			step: function (now) {
				$this_counter.text(Math.ceil(now)+'%');
			}
		});

	}
}
if ('IntersectionObserver' in window) {
	ashade.progress.observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!jQuery(entry.target).hasClass('is-done')) {
				if(entry.isIntersecting) {
					jQuery(entry.target).addClass('is-done');
					ashade.progress.animate(jQuery(entry.target)[0]);
				}
			}
		});
	});
}

// Coming Soon Count Down
ashade.count_down = {
	init : function() {
		let $dom = jQuery('#ashade-coming-soon'),
			datetime = new Date( $dom.find('time').text() + 'T00:00:00'),
			is_this;

		$dom.find('time').remove();
		this.labels = $dom.data('labels');
		this.days = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ ashade.count_down.labels[0] +'</span>');
		this.hours = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ ashade.count_down.labels[1] +'</span>');
		this.minutes = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ ashade.count_down.labels[2] +'</span>');
		this.seconds = jQuery('<h2>0</h2>')
			.appendTo($dom).wrap('<div/>')
			.after('<span>'+ ashade.count_down.labels[3] +'</span>');

		this.update( datetime );

		if ( this.interval ) {
			clearInterval( this.interval );
		}

		this.interval = setInterval( function() {
			ashade.count_down.update( datetime );
		}, 1000);
	},
	update : function( endDate ) {
		let now = new Date();
		let difference = endDate.getTime() - now.getTime();

		if (difference <= 0) {
			clearInterval( this.interval );
		} else {
			let seconds = Math.floor(difference / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours = Math.floor(minutes / 60);
			let days = Math.floor(hours / 24);

			hours %= 24;
			minutes %= 60;
			seconds %= 60;

			if (days < 10) {
				days = ("0" + days).slice(-2);
			}

			this.days.text(days);
			this.hours.text(("0" + hours).slice(-2));
			this.minutes.text(("0" + minutes).slice(-2));
			this.seconds.text(("0" + seconds).slice(-2));
		}
	}	
};

// Smooth Scroll
ashade.old_scroll_top = 0;
ashade.sScroll = {
	target: 0,
	current: 0,
	animate: function() {
		ashade.sScroll.current += ((ashade.sScroll.target - ashade.sScroll.current) * ashade.config.smooth_ease);
		$ashade_scroll.css('transform', 'translate3d(0, -'+ ashade.sScroll.current +'px, 0)');
		
		if ($ashade_scroll.height() !== $ashade_body.height()) {
			ashade.sScroll.layout();
		}
		
		requestAnimationFrame( ashade.sScroll.animate );
	},
	layout: function() {
		if ($ashade_scroll.length) {
			let this_content = $ashade_scroll.children('.ashade-content');
			this_content.css('min-height', '0px');
			
			// Set Body Height (for smooth scroll)
			if ($ashade_scroll.height() <= $ashade_window.height()) {
				let min_height = $ashade_window.height() - $ashade_footer.height();

				if (!$ashade_body.hasClass('no-header-padding'))
					min_height = min_height - $ashade_scroll.children('.ashade-header-holder').height();

				this_content.css('min-height', min_height+'px');				
				$ashade_scroll.addClass('is-centered');
			} else {
				$ashade_scroll.removeClass('is-centered');
			}
			if ($ashade_body.hasClass('ashade-smooth-scroll')) {
				$ashade_body.height($ashade_scroll.height());
			}
		}
	}
};
if ($ashade_scroll.length || $ashade_body.hasClass('ashade-home-template')) {
	ashade.sScroll.animate();
}

ashade.init = function() {
	$ashade_body.addClass('is-init');
	ashade.old_scroll_top = $ashade_window.scrollTop();
	
	// Contact Form
	if (jQuery('form.ashade-contact-form').length) {
		jQuery('form.ashade-contact-form').each(function() {
			let $this = jQuery(this),
				$response = $this.find('.ashade-contact-form__response'),
				formData;
			
			// Create New Fields
			$this.find('input').on('change', function() {
				ashade.flocker.field_changed = true;
			}).on('keyup', function() {
				ashade.flocker.field_interract = true;
			});
			$this.find('textarea').on('change', function() {
				ashade.flocker.field_changed = true;
			}).on('keyup', function(e) {
				ashade.flocker.field_interract = true;
			});
			
			$this.find('input')[0].addEventListener('touchenter', function(e) {
        		ashade.flocker.field_interract = true;
				ashade.flocker.form_interract = true;
    		}, false);
			$this.find('textarea')[0].addEventListener('touchenter', function(e) {
        		ashade.flocker.field_interract = true;
				ashade.flocker.form_interract = true;
    		}, false);
			
			this.addEventListener('touchenter', function(e) {
        		ashade.flocker.form_interract = true;
    		}, false);
			$this.on('mouseenter', function() {
				ashade.flocker.form_interract = true;
			});
			
			$this.submit(function(e) {
				e.preventDefault();
				if (ashade.flocker.form_interract && ashade.flocker.field_interract && ashade.flocker.field_changed) {
					$this.addClass('is-in-action');
					formData = jQuery(this).serialize();
					jQuery.ajax({
						type: 'POST',
						url: $this.attr('action'),
						data: formData
					})
					.done(function(response) {
						$this.removeClass('is-in-action');
						$response.empty().removeClass('alert-danger').addClass('alert-success');
						$response.html('<span>' + response + '</span>');
						$this.find('input:not([type="submit"]), textarea').val('');
						ashade.flocker.form_interract  = false;
						ashade.flocker.field_interract = false;
						ashade.flocker.field_changed   = false;
					})
					.fail(function(data) {
						$this.removeClass('is-in-action');
						$response.empty().removeClass('alert-success').addClass('alert-danger');
						$response.html('<span>' + data.responseText + '</span>');
						ashade.flocker.form_interract  = false;
						ashade.flocker.field_interract = false;
						ashade.flocker.field_changed   = false;
					});
				} else {
					if ($this.attr('data-spam-message')) {
						var spam_message = '<span>'+ $this.attr('data-spam-message') +'</span>';
					} else {
						var spam_message = '<span>No user actions detected. Look like a spam bot.</span>';
					}
					ashade.flocker.form_interract  = false;
					ashade.flocker.field_interract = false;
					ashade.flocker.field_changed   = false;
					$this.find('input:not([type="submit"]), textarea').val('');
					$response.empty().removeClass('alert-success').addClass('alert-danger');
					$response.html(spam_message);
				}
			});
		});
	}
	
	// Header Holder
	$ashade_header_holder = jQuery('<div class="ashade-header-holder"></div>');
	$ashade_header_holder.height($ashade_header.height()).prependTo($ashade_scroll);
	
	// Set Logo Size
	if (jQuery('a.ashade-logo').length) {
		jQuery('a.ashade-logo').each(function() {
			let $this = jQuery(this),
				$img = $this.children('img'),
				w = $img.attr('width'),
				h = $img.attr('height');
			if ($this.hasClass('is-retina')) {
				$this.width(w/2).height(h/2);
			} else {
				$this.width(w).height(h);
			}
		});
	}
	
	// Set Menu Active Parent Items
	if (jQuery('.current-menu-item').length) {
		jQuery('.current-menu-item').each(function() {
			jQuery(this).parents('li').addClass('current-menu-ancestor');
		});
	}
	
	// Mobile DOM Construct
	if (jQuery('.ashade-page-title-wrap').length) {
		if (jQuery('.ashade-content-wrap .ashade-content').length) {
			let ashade_mobile_title = jQuery('<div class="ashade-mobile-title-wrap">' + jQuery('.ashade-page-title-wrap').html() + '</div>');
			jQuery('.ashade-content-wrap .ashade-content').prepend(ashade_mobile_title);
		}
	}
	let ashade_mobile_header = jQuery('<div class="ashade-mobile-header">'),
		mobile_menu_button = jQuery('<a href="#" class="ashade-mobile-menu-button"><i class="la la-bars"></i></a>').appendTo(ashade_mobile_header),
		mobile_menu = jQuery('<nav class="ashade-mobile-menu"></nav>').appendTo($ashade_body),
		mobile_menu_close = jQuery('<a href="#" class="ashade-mobile-menu-close"></a>').appendTo(mobile_menu);
	
	if (jQuery('.ashade-aside-overlay').length) {
		ashade_mobile_header.append('\
			<a class="ashade-aside-toggler" href="#">\
				<span class="ashade-aside-toggler__icon01"></span>\
				<span class="ashade-aside-toggler__icon02"></span>\
				<span class="ashade-aside-toggler__icon03"></span>\
			</a>');
	}
	
	// Mobile Meintenance Email
	if ($ashade_body.hasClass('ashade-maintenance-wrap')) {
		ashade_mobile_header.prepend('<a class="ashade-contacts-toggler" href="#"><i class="la la-envelope"></i></a>');		
		jQuery(document).on('click', '.ashade-contacts-toggler', function() {
			$ashade_body.addClass('contacts-shown');
		});
		jQuery(document).on('click', '.ashade-contacts-close', function() {
			$ashade_body.removeClass('contacts-shown');
		});
	}

	$ashade_header.find('.ashade-nav-block').append(ashade_mobile_header);
	
	if ($ashade_header.find('.ashade-nav').length) {
		mobile_menu.append('\
			<div class="ashade-mobile-menu-inner">\
				<div class="ashade-mobile-menu-content">\
					'+ $ashade_header.find('.ashade-nav').html() +'\
				</div>\
			</div>\
		');
		mobile_menu.find('ul.main-menu a').on('click', function(e) {
			var $this = jQuery(this),
				$parent = $this.parent();
			if ($parent.hasClass('.menu-item-has-children') || $parent.find('ul').length) {
				e.preventDefault();
				$parent.children('ul').slideToggle(300).toggleClass('is-open');
			}
		});
		mobile_menu.find('ul.sub-menu').slideUp(1);
	}
	
	mobile_menu_button.on('click', function() {
		$ashade_body.addClass('ashade-mobile-menu-shown').addClass('is-locked');
		ashade.old_scroll_top = $ashade_window.scrollTop();
		gsap.fromTo('.ashade-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 40,
				opacity: 0,
			},
			{
				x: 0,
				y: 0,
				opacity: 1,
				duration: 0.2,
				delay: 0.3,
				stagger: 0.1,
				onComplete: function() {
					$ashade_body.removeClass('is-locked');
				}
			},
		);
	});
	
	mobile_menu_close.on('click', function() {
		let setDelay = 0;
		$ashade_body.addClass('is-locked');
		if (mobile_menu.find('.is-open').length) {
			mobile_menu.find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.ashade-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					$ashade_body.removeClass('ashade-mobile-menu-shown').removeClass('is-locked');
				}
			},
		);
	});
	
	jQuery('.ashade-menu-overlay').on('click', function() {
		$ashade_body.removeClass('ashade-mobile-menu-shown').removeClass('is-locked');
	});
	
	// Aside Open and Close
	jQuery(document).on('click', 'a.ashade-aside-toggler', function(e) {
		e.preventDefault();
		$ashade_body.addClass('ashade-aside-shown').removeClass('ashade-menu-fade');
		ashade.old_scroll_top = $ashade_window.scrollTop();
	});
	jQuery('a.ashade-aside-close').on('click', function(e) {
		e.preventDefault();
		$ashade_body.removeClass('ashade-aside-shown');
	});
	jQuery('.ashade-aside-overlay').on('click', function() {
		$ashade_body.removeClass('ashade-aside-shown');
	});

    // Main Nav Events
    jQuery('nav.ashade-nav a').on( 'mouseenter', function() {
        $ashade_body.addClass('ashade-menu-fade');
    });
    jQuery('nav.ashade-nav').on( 'mouseleave', function() {
        $ashade_body.removeClass('ashade-menu-fade');
    });

	// Back Button Functions 
	jQuery('.ashade-back').on('click', function(e) {
		e.preventDefault();
		var $this = jQuery(this);
		
		// Back to Top
		if ($this.hasClass('is-to-top')) {
			if ($ashade_window.scrollTop() > $ashade_window.height()/2) {
				$ashade_body.addClass('has-to-top');
			}
			$this.addClass('in-action');

			if (jQuery('.ashade-albums-carousel').length) {
				ashade_ribbon.target = 0;
				ashade_ribbon.currentStep = 0;
				setTimeout(function() {
					$ashade_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				},300, $this);
			} else {
				jQuery('html, body').stop().animate({scrollTop: 0}, 500, function() {
					$ashade_body.removeClass('has-to-top');
					$this.removeClass('in-action');
				});
			}
		}
		
		// Maintenace Mode - Write Message
		if ($this.hasClass('is-message')) {
			$ashade_body.addClass('is-locked in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('.ashade-content-wrap .ashade-content', {
				opacity: 0,
				y: -150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.ashade-back-wrap .is-message').hide();
					jQuery('.ashade-back-wrap .is-message-close').show();
				}
			});
			gsap.to('.ashade-page-background', {
				opacity: 0,
				scale: 1.05,
				duration: 1,
			});
			gsap.to('#ashade-contacts-wrap', {
				opacity: 1,
				y: 0,
				duration: 0.7,
				delay: 0.3,
				onComplete: function() {
					$ashade_body.removeClass('is-locked');
					jQuery('.ashade-back-wrap').addClass('is-loaded');
				}
			});
		}
		
		// Maintenace Mode - Close Message
		if ($this.hasClass('is-message-close')) {
			$ashade_body.addClass('is-locked').removeClass('in-message-mode');
			$this.parent().removeClass('is-loaded');
			gsap.to('#ashade-contacts-wrap', {
				opacity: 0,
				y: 150,
				duration: 0.7,
				onComplete: function() {
					jQuery('.ashade-back-wrap .is-message').show();
					jQuery('.ashade-back-wrap .is-message-close').hide();
				}
			});
			gsap.to('.ashade-page-background', {
				opacity: 0.13,
				scale: 1,
				duration: 1,
			});
			gsap.to('.ashade-content-wrap .ashade-content', {
				opacity: 1,
				y: 0,
				duration: 1,
				delay: 0.3,
				onComplete: function() {
					$ashade_body.removeClass('is-locked');
					jQuery('.ashade-back-wrap').addClass('is-loaded');
				}
			});
		}
		
		// Home Return
		if ($this.hasClass('is-home-return')) {
			$ashade_body.addClass('is-locked');
			gsap.fromTo('.ashade-content', 1, {
				y: 0,
				opacity: 1,
			},
			{
				y: -100,
				opacity: 0,
				duration: 1,
				onComplete: function() {
					if ($ashade_scroll.find('#ashade-home-works').length) {
						var $current_content = jQuery('#ashade-home-works');
					}
					if ($ashade_scroll.find('#ashade-home-contacts').length) {
						var $current_content = jQuery('#ashade-home-contacts');
					}
					for (var i = 0; i < 4; i++) {
						$current_content.unwrap();
					}
					ashade.sScroll.layout();
					$ashade_body.height($ashade_window.height());
				}
			});
			
			if (jQuery('.ashade-page-title-wrap').length) {
				jQuery('.ashade-page-title-wrap').removeClass('is-loaded').addClass('is-inactive');			
				gsap.to('.ashade-page-title-wrap', 0.5, {
					css: {
						top: 0,
					},
					delay: 0.5,
				});
			}
			if (jQuery('.ashade-back-wrap').length) {
				jQuery('.ashade-back-wrap').removeClass('is-loaded').addClass('is-inactive');
				gsap.to('.ashade-back-wrap', 0.5, {
					css: {
						top: '200%',
					},
					delay: 0.5,
				});				
			}
			gsap.to('.ashade-home-link--works', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.ashade-home-link--works').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.ashade-home-link--contacts', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.ashade-home-link--contacts').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.ashade-page-background', {
				opacity: 0.75,
				scale: 1,
				duration: 1,
				delay: 1,
				onComplete: function() {
					$ashade_body.removeClass('ashade-content-shown');
					$ashade_body.removeClass('is-locked');
				}
			});
		}
	});	

	// Page Background
	if (jQuery('.ashade-page-background[data-src]').length) {
		jQuery('.ashade-page-background[data-src]').each(function() {
			jQuery(this).css('background-image', 'url('+ jQuery(this).data('src') +')');
		});
	}
	// Home Template
    if ($ashade_body.hasClass('ashade-home-template')) {	
		// Home Links Events
		jQuery('.ashade-home-link').on('mouseenter', function() {
			$ashade_body.addClass('is-faded');
		}).on('mouseleave', function() {
			$ashade_body.removeClass('is-faded');
		}).on('click', function(){
			var $this = jQuery(this);
			ashade.cursor.$el.removeClass('int-link');
			$ashade_body.removeClass('is-faded').addClass('ashade-content-shown');
			jQuery('.ashade-home-link-wrap').addClass('is-inactive');
			gsap.to('.ashade-page-background', {
				opacity: 0.1,
				scale: 1.05,
				duration: 1,
				delay: 0.5,
			});
			gsap.to('.ashade-home-link--works', 0.5, {
				css: {
					top: 0,
				},
				delay: 0.5,
			});
			gsap.to('.ashade-home-link--contacts', 0.5, {
				css: {
					top: '200%',
				},
				delay: 0.5,
			});
			
			jQuery('.ashade-page-title').empty().append('<span>' + $this.find('span:first-child').text() + '</span>' + $this.find('span:last-child').text()).removeClass('is-inactive');
			jQuery('.ashade-home-return').removeClass('is-inactive');
			
			gsap.to('.ashade-page-title-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.ashade-page-title-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			gsap.to('.ashade-back-wrap', 0.5, {
				css: {
					top: '100%',
				},
				delay: 1,
				onComplete: function() {
					jQuery('.ashade-back-wrap').addClass('is-loaded').removeClass('is-inactive');
				}
			});
			
			if ($this.parent().hasClass('ashade-home-link--works')) {
				var $current_content = jQuery('#ashade-home-works');
			}
			if ($this.parent().hasClass('ashade-home-link--contacts')) {
				var $current_content = jQuery('#ashade-home-contacts');
			}
			
			$current_content.wrap('\
				<main class="ashade-content-wrap">\
					<div class="ashade-content-scroll">\
						<div class="ashade-content">\
							<section class="ashade-section"></section>\
						</div><!-- .ashade-content -->\
					</div><!-- .ashade-content-scroll -->\
				</main>\
			');

			if ($ashade_body.hasClass('ashade-smooth-scroll')) {
				$ashade_scroll = $ashade_body.find('.ashade-content-scroll');
				$ashade_body.height($ashade_scroll.height());
			}				
			ashade.layout();
			
			gsap.fromTo('.ashade-content', 1, {
				y: 100,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 1,
				delay: 1.2,
			});
		});
    }

	// All Links Events
	jQuery('a').on('click', function(e) {
		var $this = jQuery(this),
			this_href = $this.attr('href');
		if ($this.attr('target') && '_blank' == $this.attr('target')) {
			// Nothing to do here. Open link in new tab.
		} else if ($this.is('[download]')) {
			// Nothing to do here. Download Link.
		} else if (this_href.indexOf('tel:') > -1 || this_href.indexOf('mailto:') > -1) {
			// Nothing to do here. Tel or Email Link
		} else {
			if (this_href == '#') {
				e.preventDefault();
			} else if ($this.hasClass('ashade-lightbox-link')) {
				e.preventDefault();
			} else if (this_href.length > 1 && this_href[0] !== '#' && !/\.(jpg|png|gif)$/.test(this_href)) {
				e.preventDefault();
				ashade.change_location(this_href);
			}
		}
	}).on('mousedown', function(e) {
		e.preventDefault();
	});
	
	// Masonry Items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry();
		});
	}
	
	// Init Coming Soon Counter
	if ( jQuery('#ashade-coming-soon').length ) {
		ashade.count_down.init();
	}	
	
	// Before After
	if (jQuery('.ashade-before-after').length) {
		jQuery('.ashade-before-after').each(function() {
			new Ashade_Before_After(jQuery(this));
		});
	}
	
	// Kenburns Sliders
	if (jQuery('.ashade-kenburns-slider').length) {
		ashade.kenburns.init();
	}

	// Tiny Slider
	if (jQuery('.ashade-tns-container').length) {
		jQuery('.ashade-tns-container').each(function(){
			let $this = jQuery(this),
				$parent = $this.parent(),
				ashade_tns_options = {
					container: this,
					items: 1,
					axis: 'horizontal',
					mode: 'carousel',
					gutter: 0,
					edgePadding: 0,
					controls: false,
					nav: false,
					navPosition: 'bottom',
					speed: 1000,
					mouseDrag: true,
				};
		
			if ($parent.hasClass('ashade-testimonials-carousel')) {
				ashade_tns_options.autoHeight = true;
				ashade_tns_options.center = true;
				ashade_tns_options.nav = true;
				ashade_tns_options.loop = true;
				ashade_tns_options.gutter = 40;
			}
			
			// Init
			ashade_tns[$this.attr('id')] = tns(ashade_tns_options);
			
			// After Init Functions
			if ($parent.hasClass('ashade-testimonials-carousel')) {
				ashade_tns[$this.attr('id')].events.on('transitionEnd', ashade.sScroll.layout);
			}
		});
	}
	
	// Counters
	if (jQuery('.ashade-counter-item').length) {
		if ('IntersectionObserver' in window) {
			ashade.counter_observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (!jQuery(entry.target).hasClass('is-counted')) {
						if(entry.isIntersecting) {
							jQuery(entry.target).addClass('is-counted');
							ashade.counter(jQuery(entry.target).children('.ashade-counter-value')[0]);
						}					
					}
				});
			});			
		} else {
			jQuery('.ashade-counter-item').each(function() {
				jQuery(this).addClass('is-counted');
				ashade.counter(jQuery(this).children('.ashade-counter-value')[0]);
			});
		}
	}
	
	// Circle Progress Bar Init
	if (jQuery('.ashade-progress-item').length) {
		jQuery('.ashade-progress-item').each(function() {
			ashade.progress.init(this);
		});
	}
	
	// Bricks Gallery
	if (jQuery('.ashade-gallery-bricks.is-2x3').length) {
		jQuery('.ashade-gallery-bricks.is-2x3').each(function() {
			let $this = jQuery(this),
				count = 0;
			
			$this.find('.ashade-gallery-item').each(function(){
				count++;
				if (count > 5) {
					count = 1;
				}
				if (count == 1 || count == 2) {
					jQuery(this).addClass('is-large');
				} else {
					jQuery(this).addClass('is-small');
				}
			});
		});
	}
	
	// Lazy Loading Images
	if (jQuery('.lazy').length) {
		jQuery('.lazy').Lazy({
			scrollDirection: 'vertical',
			effect: 'fadeIn',
			visibleOnly: true,
			onError: function(element) {
				console.log('Error Loading ' + element.data('src'));
			},
			afterLoad: function(element) {
            	ashade.layout();
        	},
		});		
	}
	
	// Justify Gallery
	if (jQuery('.ashade-justified-gallery').length) {
		jQuery('.ashade-justified-gallery').justifiedGallery({
			rowHeight : 250,
			captions: false,
			lastRow : 'nojustify',
			margins : 10
		});
	}
	
	// Lightbox
	if ( jQuery('.ashade-lightbox-link').length ) {
		jQuery('.ashade-lightbox-link').each( function() {
			let $this = jQuery(this),
				this_item = {},
				this_gallery = 'default';
			
			if ($this.data('size')) {
				let item_size = $this.attr('data-size').split('x');
				this_item.w = item_size[0];
				this_item.h = item_size[1];
			}
			this_item.src = $this.attr('href');
			
			if ( $this.data('caption') ) {
				this_item.title = $this.data('caption');
			}
			
			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}
			
			if ( ashade.pswp.gallery[this_gallery] ) {
				ashade.pswp.gallery[this_gallery].push(this_item);
			} else {
				ashade.pswp.gallery[this_gallery] = [];
				ashade.pswp.gallery[this_gallery].push(this_item);
			}
			
			$this.data('count', ashade.pswp.gallery[this_gallery].length - 1);
		});
			
		jQuery(document).on('click', '.ashade-lightbox-link', function(e) {
			e.preventDefault();
			
			let $this = jQuery(this),
				this_index = parseInt($this.data('count'), 10),
				this_gallery = 'default',
				this_options = {
					index: this_index,
					bgOpacity: 0.85,
					showHideOpacity: true,
					getThumbBoundsFn: function(index) {
                        var thumbnail = $this[0],
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = thumbnail.getBoundingClientRect(); 
						
                        return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                    },
				};
			
			if ( $this.data('gallery') ) {
				this_gallery = $this.data('gallery');
			}
			
			ashade.pswp.lightbox = new PhotoSwipe($ashade_body.find('.pswp')[0], PhotoSwipeUI_Default, ashade.pswp.gallery[this_gallery], this_options);
			ashade.pswp.lightbox.init();
		});
	}
	
	// Spacer
	jQuery('.ashade-spacer').each(function() {
		jQuery(this).height(jQuery(this).data('size'));
	});
	
    ashade.layout();
    ashade.loading();
}

ashade.layout = function() {
	// Close Mobile Menu (if it don't use)
	if ($ashade_window.width() > 760) {
		$ashade_body.removeClass('ashade-mobile-menu-shown');
	}
	
	// Header Space Holder
	if (typeof $ashade_header_holder !== 'undefined') {
		$ashade_header_holder.height($ashade_header.height());
	}
	
	// Header Padding to Home Template
	if (jQuery('#ashade-home-works').length) {
		jQuery('#ashade-home-works').css('padding-top', $ashade_header.height()+'px');
	}
	if (jQuery('#ashade-home-contacts').length) {
		jQuery('#ashade-home-contacts').css('padding-top', $ashade_header.height()+'px');
	}
	
	// Relayout Masonry items
	if (jQuery('.is-masonry').length) {
		jQuery('.is-masonry').each(function() {
			jQuery(this).masonry('layout');
		});
	}

	// Services List Layout
	if (jQuery('.ashade-service-item').length) {
		jQuery('.ashade-service-item').each(function() {
			let $this = jQuery(this),
				$prev = $this.prev('.ashade-service-item');			
			if ($ashade_window.width() > 1200) {
				if ($prev.length) {
					var set_y = -1*($prev.height() - $prev.find('.ashade-service-item__content').height())/2;
					$this.css('margin-top', set_y +'px');
				}				
			} else {
				$this.css('margin-top', '0px');
			}
		});
	}
		
	// Fullheight Row
	if (jQuery('.ashade-row-fullheight').length) {
		jQuery('.ashade-row-fullheight').each(function() {
			var $this = jQuery(this),
				minHeight = $ashade_window.height();
			
			if ($this.hasClass('exclude-header')) {
				minHeight = minHeight - $ashade_header.height();
			}
			if ($this.hasClass('exclude-footer')) {
				minHeight = minHeight - $ashade_footer.height();
			}
			$this.css('min-height', minHeight+'px');
		});
	}
	
    // Dropdown Menu Position
    $ashade_header.find('.ashade-menu-offset').removeClass('ashade-menu-offset');
    
    $ashade_header.find('.sub-menu').each(function() {
        var $this = jQuery(this),
            this_left = $this.offset().left,
            this_left_full = $this.offset().left + $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
		
		if ( this_left_full > $ashade_window.width() ) {
			$this.addClass('ashade-menu-offset');
		}
    });

	// Circle Progress Bar
	if (jQuery('.ashade-progress-item').length) {
		jQuery('.ashade-progress-item.is-done').each(function() {
			ashade.progress.layout(this);
		});
	}
	
	// Smooth Scroll Functions
	ashade.old_scroll_top = $ashade_window.scrollTop();
	ashade.sScroll.layout();	
}

ashade.loading = function() {
	// Load Page Title and Guides
	if (jQuery('.ashade-page-title-wrap:not(.is-inactive)').length) {
		gsap.to('.ashade-page-title-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.ashade-page-title-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if (jQuery('.ashade-back-wrap:not(.is-inactive)').length) {
		gsap.to('.ashade-back-wrap:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.ashade-back-wrap:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	if ($ashade_body.hasClass('ashade-home-template')) {
		gsap.to('.ashade-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.ashade-home-link--works:not(.is-inactive)').addClass('is-loaded');
			}
		});
		gsap.to('.ashade-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '100%',
			},
			onComplete: function() {
				jQuery('.ashade-home-link--contacts:not(.is-inactive)').addClass('is-loaded');
			}
		});
	}
	
	let logoDelay = ashade.config.content_load_delay;
	if ($ashade_window.width() < 760) {
		logoDelay = 0.1;
	}
	// Load Logo
	gsap.from('.ashade-logo', {
		x: '-50%',
		opacity: 0,
		duration: 0.5,
		delay: logoDelay
	});
	
	// Load Mobile Menu
	gsap.from('.ashade-mobile-header > a', 
		{
			x: 10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: 0.1,
			stagger: 0.1
		},
	);

	// Load Menu
	gsap.from('.ashade-nav ul.main-menu > li', 
		{
			x: -10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: ashade.config.content_load_delay,
			stagger: 0.1
		},
	);
	
	// Footer Socials
	if (jQuery('.ashade-footer__socials').length) {
		if ($ashade_window.width() < 760) {
			gsap.from('.ashade-footer__socials li', 
				{
					x: 0,
					y: 20,
					opacity: 0,		
					duration: 0.2,
					delay: ashade.config.content_load_delay,
					stagger: 0.1
				},
			);			
		} else {
			gsap.from('.ashade-footer__socials li', 
				{
					x: -10,
					y: -10,
					opacity: 0,		
					duration: 0.2,
					delay: ashade.config.content_load_delay,
					stagger: 0.1
				},
			);			
		}
	}
	
	// Fotoer Copyright
	if (jQuery('.ashade-footer__copyright').length) {
		if ($ashade_window.width() < 760) {
			gsap.from('.ashade-footer__copyright', {
				y: 20,
				opacity: 0,
				duration: 0.5,
				delay: ashade.config.content_load_delay
			});
		} else {
			gsap.from('.ashade-footer__copyright', {
				x: '50%',
				opacity: 0,
				duration: 0.5,
				delay: ashade.config.content_load_delay
			});					
		}
	}
	
	// Page Background
	if (jQuery('.ashade-page-background').length) {
		gsap.from('.ashade-page-background', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: ashade.config.content_load_delay,
		});
	}
	
	// Show Content
	if (jQuery('.ashade-content').length) {
		let contentDelay = ashade.config.content_load_delay*1.7;
		if ($ashade_window.width() < 760) {
			contentDelay = 0.5;
		}
		gsap.from('.ashade-content', {
			opacity: 0,
			y: 100,
			duration: 1,
			delay: contentDelay,
			onStart: function() {
				ashade.content_loaded();
			}
		});
	}
	
	// Show Albums Ribbon Content
	if (jQuery('.ashade-albums-carousel').length) {
		if (jQuery('.ashade-albums-carousel').hasClass('is-vertical')) {
			gsap.from('.ashade-album-item__inner', {
				opacity: 0,
				y: 100,
				duration: 1,
				stagger: 0.1,
				delay: ashade.config.content_load_delay*1.7
			});
		} else {
			gsap.from('.ashade-album-item__inner', {
				opacity: 0,
				x: 100,
				duration: 1,
				stagger: 0.1,
				delay: ashade.config.content_load_delay*1.7
			});			
		}
		if (ashade_ribbon.$bar) {
			gsap.from(ashade_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
				delay: ashade.config.content_load_delay*1.7
			});			
		}
	}
	
	// Show Albums Slider Content
	if (jQuery('.ashade-albums-slider').length) {
		if (jQuery('.ashade-album-item__title').length) {
			gsap.to('.ashade-album-item__title', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.ashade-album-item__title').addClass('is-loaded');
				}
			});			
		}
		if (jQuery('.ashade-album-item__explore').length) {
			gsap.to('.ashade-album-item__explore', {
				css: {
					top: '100%',
				},
				delay: 0.5,
				duration: 1,
				onComplete: function() {
					jQuery('.ashade-album-item__explore').addClass('is-loaded');
				}
			});
		}
		gsap.fromTo('.ashade-slider-prev', {
			x: -50,
		},{
			x: 0,
			delay: ashade.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.ashade-slider-prev').addClass('is-loaded');
			}
		});
		gsap.fromTo('.ashade-slider-next', {
			x: 50,
		},{
			x: 0,
			delay: ashade.config.content_load_delay*1.7,
			duration: 0.5,
			onStart: function() {
				jQuery('.ashade-slider-next').addClass('is-loaded');
			}
		});
		gsap.from('.ashade-album-item__image', {
			scale: 1.05,
			opacity: 0,
			duration: 1,
			delay: ashade.config.content_load_delay*1.7,
		});		
	}
	
	setTimeout("$ashade_body.addClass('is-loaded')", 1500);
}

ashade.change_location = function(this_href) {
	ashade.cursor.$el.addClass('is-unloading');
	$ashade_body.addClass('is-locked');
	if ($ashade_window.width() < 760 && $ashade_body.hasClass('ashade-mobile-menu-shown')) {
		let setDelay = 0;
		$ashade_body.addClass('is-locked');
		if (jQuery('.ashade-mobile-menu').find('.is-open').length) {
			jQuery('.ashade-mobile-menu').find('ul.sub-menu').slideUp(300);
			setDelay = 0.3;
		}
		gsap.fromTo('.ashade-mobile-menu ul.main-menu > li', 
			{
				x: 0,
				y: 0,
				opacity: 1
			},
			{
				x: 0,
				y: -40,
				opacity: 0,
				duration: 0.2,
				delay: setDelay,
				stagger: 0.1,
				onComplete: function() {
					window.location = this_href;
				}
			},
		);
		return false;
	}
	$ashade_body.removeClass('is-loaded');
	if ($ashade_body.hasClass('ashade-aside-shown')) {
		$ashade_body.removeClass('ashade-aside-shown');
	}
	if ($ashade_body.hasClass('ashade-mobile-menu-shown')) {
		$ashade_body.removeClass('ashade-mobile-menu-shown');
	}
	
	if (jQuery('.ashade-content').length) {
		gsap.to('.ashade-content', {
			css: {
				opacity: 0,
				y: -100,				
			},
			duration: 0.6,
		});
	}
	// Unload Albums Carousel Content
	if (jQuery('.ashade-albums-carousel').length) {
		if (ashade_ribbon.type == 'vertical') {
			gsap.to('.ashade-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					y: -100,
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});
		} else {
			gsap.to('.ashade-album-item__inner.is-inview', {
				css: {
					opacity: 0,
					x: -100,				
				},
				stagger: 0.1,
				delay: 0.5,
				duration: 0.6,
			});			
		}
		if (ashade_ribbon.$bar) {
			gsap.to(ashade_ribbon.$bar[0], {
				opacity: 0,
				y: 20,
				duration: 1,
			});			
		}
	}

	// Unload Albums Slider Content
	if (jQuery('.ashade-albums-slider').length) {
		if (jQuery('.ashade-album-item__title').length) {
			setTimeout("jQuery('.ashade-album-item__title').removeClass('is-loaded')", 300);
			gsap.to('.ashade-album-item__title', {
				css: {
					top: '0%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		if (jQuery('.ashade-album-item__explore').length) {
			setTimeout("jQuery('.ashade-album-item__explore').removeClass('is-loaded')", 300);
			gsap.to('.ashade-album-item__explore', {
				css: {
					top: '200%',
				},
				delay: 1.2,
				duration: 1,
			});
		}
		gsap.fromTo('.ashade-slider-prev', {
			x: 0,
		},{
			x: -50,
			duration: 0.5,
			onStart: function() {
				jQuery('.ashade-slider-prev').removeClass('is-loaded');
			}
		});
		gsap.fromTo('.ashade-slider-next', {
			x: 0,
		},{
			x: 50,
			duration: 0.5,
			onStart: function() {
				jQuery('.ashade-slider-next').removeClass('is-loaded');
			}
		});
		gsap.to('.ashade-album-item__image', {
			css: {
				scale: 1.05,
				opacity: 0,				
			},
			duration: 1,
			delay: ashade.config.content_load_delay*1.7,
		});		
	}

	// Remove Logo
	gsap.to('.ashade-logo', {
		css: {
			x: '-50%',
			opacity: 0,			
		},
		duration: 0.5,
		delay: 0.5
	});

	// Remove Menu
	gsap.to('.ashade-nav ul.main-menu > li', 
		{
			css: {
				x: -10,
				y: -10,
				opacity: 0,				
			},
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);	
	
	// Unload Mobile Menu
	gsap.to('.ashade-mobile-header > a', 
		{
			x: -10,
			y: -10,
			opacity: 0,		
			duration: 0.2,
			delay: 0.5,
			stagger: 0.1
		},
	);

	// Footer Socials
	if (jQuery('.ashade-footer__socials').length) {
		gsap.to('.ashade-footer__socials li', 
			{
				css: {
					x: -10,
					y: -10,
					opacity: 0,				
				},
				duration: 0.2,
				delay: 0.5,
				stagger: 0.1
			},
		);
	}
	
	// Fotoer Copyright
	if (jQuery('.ashade-footer__copyright').length) {
		gsap.to('.ashade-footer__copyright', {
			css: {
				x: '50%',
				opacity: 0,			
			},
			duration: 0.5,
			delay: 0.5
		});
	}

	// Remove Page Title and Guides
	if (jQuery('.ashade-page-title-wrap').length) {
		setTimeout("jQuery('.ashade-page-title-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.ashade-page-title-wrap', 0.5, {
			css: {
				top: 0,
			},
			delay: 1.1,
		});
	}
	if (jQuery('.ashade-back-wrap').length) {
		setTimeout("jQuery('.ashade-back-wrap:not(.is-inactive)').removeClass('is-loaded')", 600);
		gsap.to('.ashade-back-wrap', 0.5, {
			css: {
				top: '200%',
			},
			delay: 1.1,
		});
	}
	
	// Home Template Unloading
	if ($ashade_body.hasClass('ashade-home-template')) {
		if (!$ashade_body.hasClass('ashade-home-state--contacts') && !$ashade_body.hasClass('ashade-home-state--works')) {
			var links_delay = 0.5,
				links_timeout = 0;
		} else {
			var links_delay = 1.1,
				links_timeout = 600;
		}
		setTimeout("jQuery('.ashade-home-link--works:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.ashade-home-link--works:not(.is-inactive)', 0.5, {
			css: {
				top: 0,
			},
			delay: links_delay,
		});
		setTimeout("jQuery('.ashade-home-link--contacts:not(.is-inactive)').removeClass('is-loaded')", links_timeout);
		gsap.to('.ashade-home-link--contacts:not(.is-inactive)', 0.5, {
			css: {
				top: '200%',
			},
			delay: links_delay,
		});
	}
	
	// Remove Page Background
	if (jQuery('.ashade-page-background').length) {
		gsap.to('.ashade-page-background', {
			css: {
				scale: 1.05,
				opacity: 0,				
			},
			duration: 1,
			delay: ashade.config.content_load_delay*1.7,
		});
	}

	setTimeout( function() {
		window.location = this_href;
	}, 2100, this_href);
}

// DOM Ready. Init Template Core.
jQuery(document).ready( function() {
    ashade.init();
});

$ashade_window.on('resize', function() {
	// Window Resize Actions
    ashade.layout();
	setTimeout(ashade.layout(), 500);
}).on('load', function() {
	// Window Load Actions
    ashade.layout();
}).on('scroll', function() {
	if ($ashade_body.hasClass('ashade-aside-shown')) {
		$ashade_window.scrollTop(ashade.old_scroll_top);
	}
	if ($ashade_body.hasClass('ashade-mobile-menu-shown')) {
		$ashade_window.scrollTop(ashade.old_scroll_top);
	}
	ashade.sScroll.target = $ashade_window.scrollTop();
	if (ashade.sScroll.target > ($ashade_scroll.height() - $ashade_window.height())) {
		ashade.sScroll.layout();
	}
	
	//Window Scroll Actions
	if (jQuery('.ashade-back.is-to-top:not(.in-action)').length) {
		if ($ashade_window.scrollTop() > $ashade_window.height()/2) {
			$ashade_body.addClass('has-to-top');
		} else {
			$ashade_body.removeClass('has-to-top');
		}
	}
});

// Keyboard Controls
jQuery(document).on('keyup', function(e) {
	switch(e.keyCode) {
  		case 27:  // 'Esc' Key
			if ($ashade_body.hasClass('ashade-aside-shown')) {
				$ashade_body.removeClass('ashade-aside-shown');
			}
    	break;
  		default:
    	break;
	}
});

// Init Content After Loading
ashade.content_loaded = function() {
	// Observing Counters
	if (jQuery('.ashade-counter-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.ashade-counter-item').each(function() {
				ashade.counter_observer.observe(this);
			});
		}
	}
	// Circle Progress Bar Init
	if (jQuery('.ashade-progress-item').length) {
		if ('IntersectionObserver' in window) {
			jQuery('.ashade-progress-item').each(function() {
				ashade.progress.observer.observe(this);
			});
		}
	}
	ashade.layout();
}

// Firefox Back Button Fix
window.onunload = function(){};

// Safari Back Button Fix
jQuery(window).on('pageshow', function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload() 
    }
});