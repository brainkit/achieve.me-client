function gotoStart() {
    var tabBar = $('#screenTabs')
        .removeClass('screen__tabs-hidden')
        .find('.tab-bar');
    tabBar.fadeIn();

    screenTabs.setActiveTab(2);
}

$(function () {
    FastClick.attach(document.body);
});