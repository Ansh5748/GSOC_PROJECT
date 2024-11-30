document.addEventListener('DOMContentLoaded',function(){
    const collegeCode=localStorage.getItem('selectedCollegeCode');
    const students=JSON.parse(localStorage.getItem('students')) || {};
    const studentList=document.getElementById('student-list');
    const currentPresidentContainer = document.getElementById('current-president');
    if(!collegeCode){
        studentList.innerHTML='<p>No college selected. Please go back and select a college.</p>';
        return;
    }
    const currentPresident=JSON.parse(localStorage.getItem('currentPresident')) || null;
    if(currentPresident && currentPresident.collegeCode===collegeCode){
        currentPresidentContainer.innerHTML=`
            <h2>Club President</h2>
            <img src="${currentPresident.profilePhoto}" alt="President Photo">
            <h3>${currentPresident.studentName}</h3>
            <p>Roll No: ${currentPresident.rollNo}</p>
        `;
    } 
    else{
        currentPresidentContainer.innerHTML='<p>No Club President assigned yet.</p>';
    }
    if(students[collegeCode] && students[collegeCode].length>0){
        students[collegeCode].forEach(student=>{
            const studentBlock=document.createElement('div');
            studentBlock.className='student-block';
            studentBlock.innerHTML=`
                <img src="${student.profilePhoto}" alt="Profile Photo" class="student-photo">
                <h3>${student.studentName}</h3>
                <p>Roll No: ${student.rollNo}</p>
                <button class="make-president-btn" onclick="makeClubPresident('${student.rollNo}')">Make President</button>
            `;
            studentList.appendChild(studentBlock);
        });
    } 
    else{
        studentList.innerHTML='<p>No students found for this college.</p>';
    }
});
function makeClubPresident(rollNo){
    const students=JSON.parse(localStorage.getItem('students')) || {};
    const collegeCode=localStorage.getItem('selectedCollegeCode');
    const selectedStudent=students[collegeCode]?.find(student => student.rollNo===rollNo);
    if(selectedStudent){
        localStorage.setItem('currentPresident', JSON.stringify({
            ...selectedStudent,
            collegeCode
        }));
        alert(`${selectedStudent.studentName} is now the Club President.`);
        presidentDiv.innerHTML=`
        <h2>Status: Club President</h2>
        <img src="${selectedStudent.profilePhoto}" alt="President Photo">
        <h3>${selectedStudent.studentName}</h3>
        <p>Roll No: ${selectedStudent.rollNo}</p>
    `;
    location.reload();
    } 
    else{
        alert('Student not found!');
    }
}