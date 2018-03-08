

function tabClicked(contentType) {

    var i, n, tabbedContent, newContent;

    tabbedContent = document.getElementsByClassName("tabbedContent");
    for (n=0; n<tabbedContent.length; n++) {
        tabbedContent.item(n).style.display = "none";
    }
    console.log(Modernizr.svg)
    if (Modernizr.svg) {
        var svgElements, svgAltElements;
        svgElements = document.getElementsByTagName("svg")
        svgAltElements = document.getElementsByClassName("svgAlt")
        for (n = 0; n< svgElements.length; n++) {
            svgElements[n].style.display = "none";
        }
        for (n = 0; n < svgAltElements.length; n++) {
            svgAltElements[n].style.display = "inherit";
        }
    }

    tabContent = document.getElementById(contentType);
    tabContent.style.display = "inherit";
}
