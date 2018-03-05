function tabClicked(contentType) {

    var i, tabbedContent, newContent, tabContent;

    tabbedContent = document.getElementsByClassName("tabbedContent");
    console.log(tabbedContent.size)
    for (tabContent in tabbedContent) {
        console.log(tabContent.className)
        console.log(tabContent.id)
    }

    tabContent = document.getElementById(contentType);
    tabContent.style.display = "initial";
}
