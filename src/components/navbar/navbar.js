$('#menu-mobile, .btn-close').click(function(e){
    e.preventDefault();
    var menu = $('.lista-menu ul');

    $(menu).toggleClass('active');
});
