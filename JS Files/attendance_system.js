const classList=document.getElementById('class-list');
const studentDetails=JSON.parse(localStorage.getItem('students')) || {};
const classes=JSON.parse(localStorage.getItem('classes')) || [];
const attendance=JSON.parse(localStorage.getItem('attendance')) || {};
const qrReaderElement=document.getElementById('qr-reader');
function addClass(){
    const className=prompt("Enter Class Name:");
    const mentorName=prompt("Enter Mentor Name:");
    const classTime=prompt("Enter Class Time (24-hour format, e.g., 14:00):");
    if(className && mentorName && classTime){
        const newClass={
            className,
            mentorName,
            classTime,
            qrGenerated: false
        };
        classes.push(newClass);
        localStorage.setItem('classes',JSON.stringify(classes));
        renderClasses();
    } 
    else{
        alert("Please provide all details!");
    }
}
function renderClasses(){
    classList.innerHTML="";
    classes.forEach((cls,index)=>{
        const classBlock=document.createElement('div');
        classBlock.className='class-block';
        classBlock.innerHTML=`
            <h3>${cls.className}</h3>
            <p><strong>Mentor:</strong> ${cls.mentorName}</p>
            <p><strong>Time:</strong> ${cls.classTime}</p>
            <div id="qr-container-${index}" class="qr-code"></div>
            <button onclick="generateQR(${index})">Generate QR</button>
            <button onclick="startClass(${index})" style="display:none;" id="start-button-${index}">Start Class</button>
            <p id="timer-${index}" class="countdown-timer"></p>
            <button onclick="redirectToPresent(${index})" class="present-btn">Present</button>
        `;
        classList.appendChild(classBlock);
    });
}
function generateQR(index){
    const qrContainer=document.getElementById(`qr-container-${index}`);
    const startButton=document.getElementById(`start-button-${index}`);
    const className = classes[index].className;
    qrContainer.innerHTML=`<img src="https://api.qrserver.com/v1/create-qr-code/?data=Class-${classes[index].className}&size=150x150" alt="QR Code">`;
    classes[index].qrGenerated=true;
    startButton.style.display="inline-block";
}
function startClass(index){
    const timer=document.getElementById(`timer-${index}`);
    let countdown=10;
    const countdownInterval=setInterval(()=>{
        timer.innerText=`Class starting in ${countdown} seconds...`;
        countdown--;
        if(countdown<0){
            clearInterval(countdownInterval);
            timer.innerText="Class Started!";
            removeQR(index);
        }
    },1000);
}
function removeQR(index){
    const qrContainer=document.getElementById(`qr-container-${index}`);
    qrContainer.innerHTML="";
}
function redirectToPresent(className) {
    localStorage.setItem('selectedClass', className);
    window.location.href='present_student.html';
}
function markAttendance(rollNo, className) {
    if(!attendance[className]){
        attendance[className]=[];
    }
    if(!attendance[className].includes(rollNo)){
        attendance[className].push(rollNo);
        localStorage.setItem('attendance',JSON.stringify(attendance));
    }
}
function findStudentByRollNo(rollNo){
    for(const collegeCode in studentDetails){
        const students=studentDetails[collegeCode];
        const student=students.find(s=>s.rollNo===rollNo);
        if(student)return student;
    }
    return null;
}
window.startQRScanner=(className,collegeCode)=>{
    qrReaderElement.style.display='block';
    const html5QrCode=new Html5Qrcode("qr-reader");
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox:{ width: 250, height: 250 }
        },
        (decodedText)=>{
            if(decodedText===`Class-${className}`){
                const attendance=JSON.parse(localStorage.getItem('attendance')) || {};
                if(!attendance[className]){
                    attendance[className]=[];
                }
                const currentStudent=JSON.parse(localStorage.getItem('currentStudent'));
                const isAlreadyPresent=attendance[className].some(student=>student.rollNo===currentStudent.rollNo);
                if(!isAlreadyPresent){
                    attendance[className].push({
                        rollNo: currentStudent.rollNo,
                        studentName: currentStudent.studentName,
                        profilePhoto: currentStudent.profilePhoto
                    });
                    localStorage.setItem('attendance',JSON.stringify(attendance));
                    alert('Marked present successfully!');
                    location.reload();
                } 
                else{
                    alert('You are already marked present for this class.');
                }
            } 
            else{
                alert("Invalid QR Code for this class.");
            }
            html5QrCode.stop();
            qrReaderElement.style.display='none';
        },
        (errorMessage)=>{
            console.error(`QR Code scan error: ${errorMessage}`);
        }
    ).catch(err=>{
        console.error(`Unable to start QR scanner: ${err}`);
    });
};
