function addProblemSection() {
    const problemTypes=['general','personal'];
    problemTypes.forEach((type)=>{
        const subDiv=document.createElement('div');
        subDiv.className='problem-category';
        const title=document.createElement('h4');
        title.innerText=type.charAt(0).toUpperCase()+type.slice(1);
        subDiv.appendChild(title);
        const messageBox=document.createElement('textarea');
        messageBox.placeholder=`Type your ${type} problem...`;
        subDiv.appendChild(messageBox);
        const timerInput=document.createElement('input');
        timerInput.placeholder='Timer (minutes)';
        subDiv.appendChild(timerInput);
        const sendButton = document.createElement('button');
        sendButton.innerText='Post Problem';
        sendButton.onclick=()=>postProblem(type,messageBox.value,timerInput.value);
        subDiv.appendChild(sendButton);
        document.getElementById(type + '-issues').appendChild(subDiv);
    });
}
function postProblem(type, message, timer){
    if(!message.trim()){
        alert('Problem description cannot be empty');
        return;
    }
    const timerMinutes=parseInt(timer,10);
    if(isNaN(timerMinutes) || timerMinutes <= 0){
        alert('Please provide a valid timer in minutes');
        return;
    }
    let problems=JSON.parse(localStorage.getItem('problems')) || {};
    if(!problems[type]){
        problems[type]=[];
    }
    problems[type].push({message,timerMinutes,votes:0});
    localStorage.setItem('problems', JSON.stringify(problems));
    alert('Problem posted!');
    displayProblems(type);
}
function displayProblems(type){
    const problems=JSON.parse(localStorage.getItem('problems')) || {};
    const problemSection=document.getElementById(type + '-issues');
    const typeProblems=problems[type] || [];
    problemSection.innerHTML='';
    typeProblems.forEach((problem,index)=>{
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem-item';
        problemDiv.innerHTML = `
            <p>${problem.message}</p>
            <p><strong>Expires in:</strong> ${problem.timerMinutes} minutes</p>
            <p>Votes: ${problem.votes}</p>
            <button onclick="voteOnProblem('${type}', ${index})">Vote</button>
        `;
        problemSection.appendChild(problemDiv);
    });
}
function voteOnProblem(type,index){
    let problems = JSON.parse(localStorage.getItem('problems')) || {};
    if(!problems[type]){
        problems[type]=[];
    }
    problems[type][index].votes++;
    localStorage.setItem('problems',JSON.stringify(problems));
    alert('Vote counted!');
    displayProblems(type);
}
addProblemSection();
