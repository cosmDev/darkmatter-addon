console.log('hello world background todo something~')

chrome.runtime.onMessageExternal.addListener(
  async function(request, sender, sendResponse) {
    console.log(request)
    if (request.type === 'init') {
      sendResponse({ answer: 'Init!' });
    } else if (request.type === 'connect') { 
      await chrome.storage.sync.set({ "chainSelected": request.chainId } , function(){});       
      chrome.windows.create({'url': 'connect.html#connect', 'type': 'popup', 'height': 600, 'width': 410}, function() { 
        chrome.runtime.onMessage.addListener(function (request2, sender2) {
          console.log('Hello from the background')
          console.log(request2)
          console.log(sender2) 
          sendResponse({ status: 'success', data: request2.account }); 
          chrome.windows.close();
        })        
        // sendResponse({ answer: 'Connect open!' });   
      });      
    } else {
      await chrome.storage.sync.set({ "txData": request } , function(){
        //  Data's been saved boys and girls, go on home
       });
       chrome.storage.sync.get(/* String or Array */["txData"], function(items){
         console.log(items)
       });     
       chrome.windows.create({'url': 'tx.html#tx', 'type': 'popup', 'height': 600, 'width': 410}, function() { 
         sendResponse({ status: 'success', data: 'Tx open!' });      
       }); 
    }
  }
);
