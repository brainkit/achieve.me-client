/*function gotoStart() {
    $('#screenTabs').removeClass('ng-hide').removeAttr('ng-hide');
    var tabBar = $('#screenTabs')
        .removeClass('screen__tabs-hidden')
        .find('.tab-bar');
    tabBar
        .removeClass('ng-hide')
        .fadeIn();

    screenTabs.setActiveTab(0);
}
*/
/*
 * функция смены страницы
 */
/*function screenNavPushPage (id, animation) {
    if(typeof animation == "undefined" && !animation){
        animation = "slide";
    }
    screenNav.pushPage(id, { animation: animation});
}
*/


function inWindow(s){
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();  
    var currentEls = $(s);
    var result = [];
    currentEls.each(function(){
        var el = $(this);
        var offset = el.offset();
        if(scrollTop <= offset.top && (el.height() + offset.top) < (scrollTop + windowHeight))
            result.push(this);
    });
    return $(result);
}