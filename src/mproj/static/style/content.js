///
/// Boost Source: https://arcboosts.com/boosts/46/chatgpt-embed-in-all-page#code_block
///

var iframe = document.createElement("iframe");
iframe.src = "https://chat.openai.com/chat";
iframe.width = "0";
iframe.height = "800";
iframe.setAttribute('frameborder','0');
iframe.setAttribute('id','chatBot');
iframe.style.transition = "width 0.5s ease-in-out";


var container = document.createElement("div");
container.style.width = "50px";
container.style.height = "50px";
container.style.overflow = "hidden";
container.setAttribute('id','containerChatbot');
container.style.transition = "width 0.5s ease-in-out";
container.style.transition = " 0.5s ease-in-out";


container.appendChild(iframe);


var openButton = document.createElement("button");
openButton.setAttribute('id','openChatbot');
openButton.innerHTML = "ChatGPT";
container.appendChild(openButton);

openButton.addEventListener("click", function() {
    iframe.style.width = "600px";
    container.style.width = "600px";
    container.style.height = "800px";
    openButton.classList.toggle("hide");
    closeButton.classList.toggle("hide");

});

var closeButton = document.createElement("button");
closeButton.setAttribute('class', 'hide');
closeButton.setAttribute('id','closeChatbot');

closeButton.innerHTML = "Close";
container.appendChild(closeButton);

document.body.appendChild(container);

closeButton.addEventListener("click", function() {
        container.style.width = "50px";
        iframe.style.width = "0px";
        
        container.style.height = "50px";

        closeButton.classList.toggle("hide");
        openButton.classList.toggle("hide");


});