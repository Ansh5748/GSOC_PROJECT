document.addEventListener('DOMContentLoaded',function(){
    const selectedCollegeCode=localStorage.getItem('selectedCollegeCode');
    const colleges=JSON.parse(localStorage.getItem('colleges')) || [];
    const attendanceClasses=JSON.parse(localStorage.getItem('classes')) || [];
    const attendance=JSON.parse(localStorage.getItem('attendance')) || {};
    const students=JSON.parse(localStorage.getItem('students')) || {};
    const collegeDetailsContainer=document.getElementById('college-details-container');
    const attendanceList=document.getElementById('attendance-list');
    const qrReaderElement=document.getElementById('qr-reader');
    const currentStudent=JSON.parse(localStorage.getItem('currentStudent'));
    const selectedCollege = colleges.find(college=>college.collegeCode===selectedCollegeCode);
    if(!selectedCollege){
        collegeDetailsContainer.innerHTML = `
            <p>No details available for the selected college. Please select a valid college.</p>
        `;
        return;
    }
    collegeDetailsContainer.innerHTML=`
        <img src="${selectedCollege.logo}" alt="College Logo" class="college-logo">
        <h1 class="college-info">${selectedCollege.collegeName}</h1>
        <h3 class="college-info">Address: ${selectedCollege.collegeAddress}</h3>
        <h3 class="college-info">Unique Code: ${selectedCollege.collegeCode}</h3>
    `;
    attendanceClasses.forEach((cls, index)=>{
        const isPresent=attendance[cls.className]?.some(student=>student.rollNo===currentStudent.rollNo);
        const attendanceBlock=document.createElement('div');
        attendanceBlock.className='attendance-block';
        attendanceBlock.innerHTML=`
            <h3>${cls.className}</h3>
            <p><strong>Mentor:</strong> ${cls.mentorName}</p>
            <p><strong>Time:</strong> ${cls.classTime}</p>
            ${isPresent ? `<span class="status-present">Present ✓</span>` : ''}
            <button onclick="startQRScanner('${cls.className}', '${selectedCollegeCode}')">Scan QR</button>
        `;
        attendanceList.appendChild(attendanceBlock);
    });
    window.startQRScanner=(className,collegeCode)=>{
        qrReaderElement.style.display='block';
        const html5QrCode=new Html5Qrcode("qr-reader");
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText)=>{
                if(decodedText===`Class-${className}`) {
                    const attendance=JSON.parse(localStorage.getItem('attendance')) || {};
                    if(!attendance[className]){
                        attendance[className]=[];
                    }
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
});
