document.addEventListener('DOMContentLoaded',function(){
    const formSections=['rating','doubt','important','urgent'];
    const formList=document.getElementById('form-list');
    formSections.forEach((section)=>{
        const sectionDiv=document.createElement('div');
        sectionDiv.className='form-item';
        sectionDiv.id=`${section}-section`;
        const title=document.createElement('h3');
        title.innerText=section.charAt(0).toUpperCase() + section.slice(1);
        sectionDiv.appendChild(title);
        const messageBox=document.createElement('textarea');
        messageBox.placeholder=`Type your ${section} message...`;
        sectionDiv.appendChild(messageBox);
        const timerInput=document.createElement('input');
        timerInput.placeholder='Timer (minutes)';
        sectionDiv.appendChild(timerInput);
        const linkInput=document.createElement('input');
        linkInput.placeholder='Add link (required)';
        sectionDiv.appendChild(linkInput);
        const sendButton=document.createElement('button');
        sendButton.innerText='Send';
        sendButton.onclick=()=>sendMessage(section,messageBox.value,timerInput.value,linkInput.value);
        sectionDiv.appendChild(sendButton);
        formList.appendChild(sectionDiv);
    });
    function sendMessage(section,message,timer,link){
        if(!link){
            alert('Link is required to send a message');
            return;
        }
        if(!message.trim()){
            alert('Message cannot be empty');
            return;
        }
        const timerMinutes=parseInt(timer,10);
        if(isNaN(timerMinutes) || timerMinutes<=0) {
            alert('Please provide a valid timer in minutes');
            return;
        }
        const messageData={ message,timerMinutes,link,section,timestamp:Date.now(),expiresAt:Date.now()+timerMinutes*60000 };
        let allMessages=JSON.parse(localStorage.getItem('messages')) || {};
        if(!allMessages[section]){
            allMessages[section]=[];
        }
        allMessages[section].push(messageData);
        localStorage.setItem('messages',JSON.stringify(allMessages));
        alert('Message sent!');
        displayMessages(section);
    }
    function displayMessages(section){
        const messages=JSON.parse(localStorage.getItem('messages')) || {};
        const sectionMessages=messages[section] || [];
        const sectionDiv=document.getElementById(`${section}-section`);
        sectionDiv.innerHTML='';
        const validMessages=sectionMessages.filter(message=>message.expiresAt>Date.now());
        if(validMessages.length===0){
            const noMessagesDiv=document.createElement('div');
            noMessagesDiv.className='no-message';
            noMessagesDiv.innerText='No messages yet. Please send a message!';
            sectionDiv.appendChild(noMessagesDiv);
        }
        validMessages.forEach(messageData=>{
            const messageDiv=document.createElement('div');
            messageDiv.className='message-item';
            const remainingTime=messageData.expiresAt-Date.now();
            const remainingMinutes=Math.floor(remainingTime/60000);
            const remainingSeconds=Math.floor((remainingTime%60000)/1000);
            messageDiv.innerHTML=`
                <p>${messageData.message}</p>
                <p><strong>Expires in:</strong> ${messageData.timerMinutes} minutes</p>
                <p><a href="${messageData.link}" target="_blank">${messageData.link}</a></p>
            `;
            sectionDiv.appendChild(messageDiv);
        });
        const expiredMessages=sectionMessages.filter(message=>message.expiresAt<=Date.now());
        if(expiredMessages.length>0){
            removeExpiredMessages(section,expiredMessages);
        }
    }
    function removeExpiredMessages(section,expiredMessages){
        let allMessages=JSON.parse(localStorage.getItem('messages')) || {};
        if(!allMessages[section]){
            return;
        }
        const filteredMessages=allMessages[section].filter(message=>!expiredMessages.includes(message));
        allMessages[section]=filteredMessages;
        localStorage.setItem('messages',JSON.stringify(allMessages));
    }
});
    