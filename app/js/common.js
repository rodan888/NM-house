$(function() {
	var main = {
		opt: {
			body: $('body'),
			header: $('header'),
			mobButton: $('.mob-button'),
			sideNav: $('.side-nav'),
			searchButton: $('.search-button'),
			tabs: $('.tabs'),
			ajaxButton: $('.load-more'),
			ajaxArhive: $('.nav-ajax button'),
			asideBun: $('.attachment'),
			popup: $('.btn.pop'),
			popupSlider: $('.popup-slider'),
			popupPortfolio: $('.popup-portfolio'),
			menuDrop: $('.level-two'),
			footToggle: $('#foot-toggle'),				
			filter: $('.filter'),
			nav: $('nav'),
			img: $('img'),
			linc: $('a'),
			wind: $(window),
			gridAjax: $('.grid.ajax'),
			grid: $('.grid'),
			gridFirst: $('.grid.gallery.first'),
			gridSecond: $('.grid.gallery.second'),
			packeryOptions: {
				itemSelector: '.card-grid',
				gutter: 4
			},
			packeryOptionsI: {
				itemSelector: '.grid-item',
				gutter: 14
			},
			slider: $('.slider'),
			slideSidebar: $('.slider-sidebar'),
			sliderBottom: $('.slider-bottom'),
			sliderFour: $('.slider-four'),
			sliderTwo: $('.slider-two'),
			owlTest: function(bool,items,autoH){
				var owlOpt = function(){					
						this.navigation = true, 
						this.slideSpeed = 300,
						this.autoPlay = 3000,
						this.navigation = true,
						this.autoPlay = false,	
						this.autoHeight = autoH,
						this.pagination = true,
						this.scrollPerPage = true,
						this.singleItem = bool,
						this.items = items,
						this.itemsDesktop = [1199,2],
						this.itemsDesktopSmall = [991,2],             						
						this.navigationText = ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>']												
				};
				return new owlOpt;
			}		
		},
		docScroll: function(el, moveEndEl){			
			var elPos = el.offset().top,
					elH   = el.height(),
					headH = this.opt.header.height();

			$(window).on('scroll',function(){
				var posTop = $(this).scrollTop(),
						maxPos = moveEndEl.offset().top,
						moveStart = posTop - (elPos - headH),
						moveEnd = maxPos - (elH - headH);

				 if(moveStart > 0 && moveStart < (moveEnd - posTop)){
				 		el.css('top', moveStart+'px');
				 };	
			});			
		},		
		scroolTo: function(btn, block){			
			var menuH = main.opt.header.height();

			$(btn).on('click', function(){
				$('body, html').animate({scrollTop: $(block).offset().top - menuH}, 1000);
			});
		},
		ajaxJournal: function(){
			this.opt.ajaxArhive.on('click', function(){
				var url     = $(this).data('ajax'),
						parrent = $(this).data('parrent'),
						filter  = $(this).data('filter'),
						limit   = $(this).data('limit'),
						tpl     = $(this).data('tpl');

				main.opt.ajaxArhive.removeClass('active');
				$(this).addClass('active');
				main.opt.grid.children().detach();
				$('.ajax-wrap .preloader').fadeIn('fast');

				if (filter) {
					$.get(url+'?parent='+parrent+'&filter='+filter,  function(data) {
						$('.ajax-wrap .preloader').fadeOut('fast');
						main.opt.grid.append( data )					   
							.packery('reloadItems')
							.packery( 'layout' );
					});
				}else if ($('#housefilter').length) {
					$.get(url+'?parent='+parrent+'&tpl='+tpl+'&limit='+limit,  function(data) {
						$('.ajax-wrap .preloader').fadeOut('fast');
						var list =  $.parseHTML( data ),
								l = list.length,
								topB = [],
								botB = [];
								console.log('Good');


						for(var i = 0; i<l;i++){
							if(i<6){
								topB.push(list[i]);
							}else{
								botB.push(list[i]);
							};
						};						
						main.opt.gridSecond.append( botB )					   
							.packery('reloadItems')
							.packery( 'layout' );								
						main.opt.gridFirst.append( topB )					   
							.packery('reloadItems')
							.packery( 'layout' );
						main.insertCustom();
					});
				}else{
					$.get(url+'?parent='+parrent+'&tpl='+tpl+'&limit='+limit,  function(data) {
						$('.ajax-wrap .preloader').fadeOut('fast');
						main.opt.grid.append( data )					   
							.packery('reloadItems')
							.packery( 'layout' );
					});
				};
			});
		},
		ajaxPackery: function(){
			var btn         = this.opt.ajaxButton,
			 		offsetCount = btn.data('start'),
					countPage   = btn.data('count');

			if(offsetCount >= countPage){
				btn.detach();
			};

			btn.on('click', function() {
				$(this).addClass('load');

				//Local ajax emulation
				// $.getJSON('pin-list.json', function(data) {
				// 	var res = [];
				// 	for(var i = 0; i<data.pinlist.length; i++){
				// 		res.push(data.pinlist[i].html);
				// 	};					
				// 		main.opt.grid.append( res )					   
				// 		.packery('reloadItems')
				// 		.packery( 'layout' );
				// });


				//ANCOMENTED TO PROD
				var url     = $(this).data('ajax'),
					  limit   = $(this).data('count'),
					  parrent = $(this).data('parent'),
					  tpl     = $(this).data('tpl'),
					  offset  = $(this).data('offset'),
					  blockAp = $(this).data('append');
				
				$.get(url+'?offset='+offsetCount+'&parent='+parrent+'&limit='+offset+'&tpl='+tpl,  function(data) {
					if(blockAp){
						$("."+blockAp).append(data);
					}else{
						main.opt.gridAjax.append( data )					   
							.packery('reloadItems')
							.packery( 'layout' );						
					}
				});
				offsetCount +=offset;
				if(offsetCount >= limit){
					$(this).detach();
				}else{
					$(this).removeClass('load');
				};
			});
		},
		dropDownMenu: function(){			
			main.toggleC(main.opt.mobButton);			
			var sidenavLinc = main.opt.sideNav.find('.level-one');			
			sidenavLinc.on('click', function(){								
				sidenavLinc.not($(this)).find('.level-two').slideUp('slow');
				$(this).find('.level-two')
					.slideToggle('slow')
			});
			
			main.opt.mobButton.on('click',function(){
				if ($(this).hasClass('active')) {

				  $(document).keydown(function(e) {
		        if( e.keyCode === 27 ) {			      
							main.opt.mobButton.click();			          
		          return false;
		        }
					});

					$('main').css('margin-left','250px')
						.addClass('ohidden');
					main.opt.body.addClass('ohidden');
					main.opt.sideNav
						.addClass('active')						
						.css({
							height: $(window).height() - $('.navbar').height()+'px',									
							left: '0px'
					});
				}else{
					main.opt.body.removeClass('ohidden');
					main.opt.sideNav
						.removeClass('active')
						.css('left','-250px');
					$('main').css('margin-left','0px')
						.removeClass('ohidden');
				}
			})
		},
		popupSlider: function(el){
			el.each(function() { 
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					gallery: {
						enabled:true
					}
				});
			});
		},
		packeryFilter: function(){
			var el = $('.packery-nav li'),
					item = $('.card-grid'),
					filter;

			el.on('click',function(){
				filter = $(this).data('filter');
				item.fadeOut('fast');
				// .css('display','none');
				$('.'+filter).fadeIn('fast', function(){
					$(this).addClass('card-grid');					
					main.opt.grid.packery(main.opt.packeryOptionsI);
				});
			});
		},
		formatMenu: function(){					
			this.opt.nav.find('>ul li').mouseover(function(){								
				var lt = $(this).find(main.opt.menuDrop),
					lists = lt.find('ul'),
					listsW = lists.width(),
					listsL = lists.length;

				lt.width(listsW * listsL+((listsL-1)*20)+'px');	
				main.opt.nav.find('>ul li').not($(this)).removeClass('active');
				$(this).toggleClass('active');
			}).mouseout(function(){
				main.opt.nav.find('>ul li').removeClass('active');				
			});	
		},
		formSearch: function(){
			var searchForm = $('#searchForm'),
				windW      = main.opt.wind.width();
			this.opt.searchButton.on('click', function(){
				searchForm.toggleClass('active');
				if (searchForm.hasClass('active')) {
					if(windW > 768){
						searchForm.width(main.navWidth());						
					}else{
						searchForm.width(windW - 65+'px');		
					}
				}else{
					searchForm.width(0);					
				}
			});
		},
		navWidth: function(){
			return this.opt.nav.width();
		},
		tabs: function(el){
			var linc = el.find('.tab-link'),
					tab  = el.find('.tab'),
					dataShow;
			linc.on('click',function(){				
				dataShow = $(this).data('show');
				linc.removeClass('active');
				$(this).addClass('active');

				tab.css('display','none')
				.find('.tab-content').removeClass('active');

				$('#'+dataShow).fadeIn(600)
				.find('.tab-content').addClass('active');
			});
		},
		popup: function(el){
			el.on('click',function(event){
				event.preventDefault();		
				var show = $(this).data('show'),
						pop  = $('#'+ show);

				pop.fadeIn(600)
				.css('height', $(window).height() + 'px')
				.find('.popup-content')
				.removeClass('anim')
				.append('<span class="fade_out">&#9587;</span>')
				
				$('.fade_out,.popup-close').click(function(){
					pop.fadeOut(600)
					.find('.popup-content')
					.addClass('anim');
					$('.fade_out').detach();
				});
			});
		},
		owlThumb: function(){
			var sync1 = $(".owlThumb1");
		  var sync2 = $(".owlThumb2");
		 
		  sync1.owlCarousel({
		    singleItem : true,
		    slideSpeed : 1000,
		    navigation: true,
		    pagination:false,
		    afterAction : syncPosition,
		    responsiveRefreshRate : 200,
		  });		 
		  sync2.owlCarousel({
		    items : 8,
		    itemsDesktop      : [1199,8],
		    itemsDesktopSmall     : [979,8],
		    itemsTablet       : [768,6],
		    itemsMobile       : [479,4],
		    pagination:false,
		    responsiveRefreshRate : 100,
		    afterInit : function(el){
		      el.find(".owl-item").eq(0).addClass("synced");
		    }
		  });		 
		  function syncPosition(el){
		    var current = this.currentItem;
		    $(".owlThumb2")
		      .find(".owl-item")
		      .removeClass("synced")
		      .eq(current)
		      .addClass("synced")
		    if($(".owlThumb2").data("owlCarousel") !== undefined){
		      center(current)
		    }
		  }		 
		  $(".owlThumb2").on("click", ".owl-item", function(e){
		    e.preventDefault();
		    var number = $(this).data("owlItem");
		    sync1.trigger("owl.goTo",number);
		  });		 
		  function center(number){
		    var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
		    var num = number;
		    var found = false;
		    for(var i in sync2visible){
		      if(num === sync2visible[i]){
		        var found = true;
		      }
		    }		 
		    if(found===false){
		      if(num>sync2visible[sync2visible.length-1]){
		        sync2.trigger("owl.goTo", num - sync2visible.length+2)
		      }else{
		        if(num - 1 === -1){
		          num = 0;
		        }
		        sync2.trigger("owl.goTo", num);
		      }
		    } else if(num === sync2visible[sync2visible.length-1]){
		      sync2.trigger("owl.goTo", sync2visible[1])
		    } else if(num === sync2visible[0]){
		      sync2.trigger("owl.goTo", num-1)
		    }		    
		  }
		},
		footToggle: function(){
			var block = this.opt.footToggle.parent('.logo-wrap');
			this.opt.footToggle.on('click',function(){
				$(this).find('i').toggleClass('fa-caret-down fa-caret-up');
				block.next().slideToggle('fast');
			});
		},
		toggleC: function(el){
			el.on('click',function(){
				el.not($(this)).removeClass('active');
				$(this).toggleClass('active');
			});
		},
		winH: function(){
			return this.opt.wind.height();
		},
		fullHeight: function(el){
			$(el).css('min-height',this.winH()+'px');
		},
		dragstart: function(el){
			$(el).on('dragstart',function(event){
				event.preventDefault();
			});
		},
		insertCustom: function(){			
		  var el  = main.opt.gridFirst.find('.card-grid');
					// cardWrap   = $('#customCard div'),
					// cardFirst  = cardWrap.eq(0),
					// cardSecond = cardWrap.eq(1),
					// cardFird   = cardWrap.eq(2);
			if($('#housefilter').length){
				$('<div class="decor card-grid hover"><div class="img-block"><img src="design/img/house-k.jpg" alt="дом под ключ"><div class="title-wrap"><a href="proektyi-domov/dom-pod-klyuch/" class="tag white">Раздел</a><h3><a href="proektyi-domov/dom-pod-klyuch/">Дом под ключ</a></h3><a href="proektyi-domov/dom-pod-klyuch/" class="read-more"><i class="fa fa-long-arrow-right"></i></a></div></div></div>')
					.insertAfter(el.eq(1));				
				var elString = '<div class="card-grid pinBun"><div class="img-block"><img src="design/img/pinBun.jpg" alt="foto"></div><div class="title-wrap"><a href="" class="tag defoult">Реклама</a><h3><a href="#">Девять цветов от Farrow &amp; Ball</a></h3><a href="#" class="read-more"><i class="fa fa-long-arrow-right"></i></a></div></div><div class="decor card-grid hover"><div class="img-block"><img src="design/img/house-p.jpg" alt="проектирование"><div class="title-wrap"><a href="proektyi-domov/individualnoe-proektirovanie/" class="tag white">Раздел</a><h3><a href="proektyi-domov/individualnoe-proektirovanie/">Индивидуальное проектирование</a></h3><a href="proektyi-domov/individualnoe-proektirovanie/" class="read-more"><i class="fa fa-long-arrow-right"></i></a></div></div></div>';
				main.opt.gridFirst.append( elString )						
					.packery('reloadItems')
					.packery( 'layout' );
			};
		},
		// formatText: function(){
		// 	var textB = $('.cont.design p');

		// 	textB.eq(0).addClass('active');
		// },
		init: function(){			
			// default functions
			this.dragstart(this.opt.img);
			this.dragstart(this.opt.linc);

			// tabs init 
			this.tabs($('#tabs1'));
			this.tabs($('#tabs2'));
			this.tabs($('#tabs3'));
			this.tabs($('#tabs4'));

			//Owl slider init
			this.opt.slider.owlCarousel(main.opt.owlTest(true,1,false));
			//Owl slider sidebar init			
			this.opt.slideSidebar.owlCarousel(main.opt.owlTest(true,1,false));
			//Owl multiple items init
			this.opt.sliderBottom.owlCarousel(main.opt.owlTest(false,3,false));
			//Owl four items init
			this.opt.sliderFour.owlCarousel(main.opt.owlTest(false,4,false));
			//Owl thumb prev
			this.owlThumb();
			//Owl house project
			this.opt.sliderTwo.owlCarousel(main.opt.owlTest(false,2,true));

			//dropDownMenu
			this.dropDownMenu();
			// popup init
			this.popup(this.opt.popup);
			// Add el window height
			this.fullHeight(this.opt.body);			
			//Packry nav toggle class
			this.toggleC(this.opt.filter);
			//Search button toggle
			this.toggleC(this.opt.searchButton);
			//Form search toggle animated
			this.formSearch();
			//Slide toggle footer
			this.footToggle();
			//Packery grid
			this.opt.grid.packery();
			//Packery filter
			this.packeryFilter();
			//Popup slider
			this.popupSlider(this.opt.popupSlider);
			this.popupSlider(this.opt.popupPortfolio);
			//Attachment sidebar
			if (this.opt.asideBun.length && this.opt.wind.width() > 992) {			
				this.docScroll(this.opt.asideBun, $('.team-block'));				
			};		
			// text format functions
			//this.formatText();

			this.scroolTo('.btn.register','section.feedbeck');
			this.scroolTo('.btn.scr','section.form');
			this.scroolTo('.scrl-btn','section.advantages');


			this.ajaxPackery();
			this.ajaxJournal();

			$(window).on('load', function(){
				//Append custom page in bild-progect
				main.insertCustom();

				//Auto replase level two menu item
				main.formatMenu();
			});
		}
	};

	//E-mail Ajax Send
	$("form.send").submit(function() { 
		var th = $(this);
		$.ajax({
			type: "POST",
			url: this.action,
			data: th.serialize()
		}).done(function() {
			if(th.hasClass('subscribe')){
				setTimeout(function() {		
					$('.fade_out').click();
					alert("Спасибо! Вы подписаны на новости NM HOUSE");
				}, 3000);	
			}else{
				alert("Спасибо за заявку!");
			}			
			setTimeout(function() {		
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});


	$(document).ready(function(){
		main.init();
			
		//PARALLAX	
		function fullscreenFix(){
			var a=$("body").height();

			$(".content-b").each(function(i){
				$(this).innerHeight()<=a&&$(this)
				.closest(".fullscreen")
				.addClass("not-overflow")
			});
		};
		function backgroundResize(){
			var a=$(window).height();
			$(".paralbackground").each(function(i){
				var t=$(this),
				e=t.width(),
				s=t.height(),
				o=t.attr("data-img-width"),
				n=t.attr("data-img-height"),
				r=o/n,
				l=parseFloat(t.attr("data-diff"));
				l=l?l:0;
				var c=0;
				if(t.hasClass("parallax")&&!$("html").hasClass("touch")){c=a-s}
				n=s+c+l,
				o=n*r,
				e>o&&(o=e,n=o/r),
				t.data("resized-imgW",o),
				t.data("resized-imgH",n),
				t.css("background-size",
				o+"px "+n+"px")});
		};
		function parallaxPosition(a){
			var i=$(window).height(),
			t=$(window).scrollTop(),
			e=t+i,
			s=(t+e)/2;
			$(".parallax").each(function(a){
				var o=$(this),
				n=o.height(),
				r=o.offset().top,
				l=r+n;
				if(e>r&&l>t){
					var c=(o.data("resized-imgW"),
							o.data("resized-imgH")),
							d=0,
							h=-c+i,
							u=i>n?c-n:c-i;
					r-=u,l+=u;
					var g=d+(h-d)*(s-r)/(l-r),
							w=o.attr("data-oriz-pos");
					w=w?w:"50%",
					$(this).css("background-position",w+" "+g+"px");
					};
				}
			)}
			"ontouchstart"in window&&(document.documentElement.className=document.documentElement.className+" touch"),
			$("html").hasClass("touch")||$(".parallax").css("background-attachment","fixed"),
			$(window).resize(fullscreenFix),
			fullscreenFix(),$(window).resize(backgroundResize),
			$(window).focus(backgroundResize),
			backgroundResize(),
			$("html").hasClass("touch")||($(window).resize(parallaxPosition),
			$(window).scroll(parallaxPosition),
			parallaxPosition());


		//Chrome Smooth Scroll
		try {
			$.browserSelector();
			if($("html").hasClass("chrome")) {
					$.smoothScroll();
			}
		} catch(err) {

		};
	});
});
