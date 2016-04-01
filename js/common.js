jQuery(document).ready(function ($) {
	"use strict";
	$('#scroll').perfectScrollbar();
	
	$('.menu ul li.head .title, .menu ul li.head .icon').on('click', function () {
		$(this).siblings('.subMenu').slideToggle(500);
		var ul = $(this).siblings('.subMenu');
		var li = ul.children('li');
		var a = li.children('a');
		if (a.hasClass('active')) {
			this.addClass('active')
		}else{
			$('.subMenu li a').removeClass('active');
		}
	});
	$('.subMenu li a').on('click', function(){
		$('.subMenu li a').removeClass('active');
		$('.menu ul li.head').removeClass('blackBg');
		$(this).addClass('active');
		var li = $(this).parent('li');
		var ul = li.parent('ul');
		var liH = ul.prev('li');
		liH.addClass('blackBg');	
	});
	
	$('.subMenu').on('mouseenter', function(){
		var ul = $(this);
		var li = ul.prev('li');
		li.toggleClass('blackBg');
	});
	$('.subMenu').on('mouseleave', function(){
		var ul = $(this);
		var li = ul.prev('li');
		li.toggleClass('blackBg');
	});
	
	$('.menu ul li.head').on('click',function(){
		$('.menu ul li.head').removeClass('blackBg');
		$(this).addClass('blackBg');
	});
});