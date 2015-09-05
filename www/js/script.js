function gotoStart() {
    $('#screenTabs').removeClass('ng-hide').removeAttr('ng-hide');
    var tabBar = $('#screenTabs')
        .removeClass('screen__tabs-hidden')
        .find('.tab-bar');
    tabBar
        .removeClass('ng-hide')
        .fadeIn();

    screenTabs.setActiveTab(1);
}

function screenNaPushPage(id) {
    screenNav.pushPage(id, { animation: "slide" });
}

$(function () {
    FastClick.attach(document.body);
});