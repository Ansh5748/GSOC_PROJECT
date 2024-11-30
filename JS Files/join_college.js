function joinCollege(event) {
    event.preventDefault();
    const studentName=document.getElementById('studentName').value.trim();
    const rollNo=document.getElementById('rollNo').value.trim();
    const collegeCode=document.getElementById('collegeCode').value.trim();
    const profilePhoto=document.getElementById('profilePhoto').files[0];
    if(!studentName || !rollNo || !collegeCode || !profilePhoto){
        alert("All fields are required!");
        return;
    }
    const colleges=JSON.parse(localStorage.getItem('colleges')) || [];
    const college=colleges.find(c => c.collegeCode === collegeCode);
    if(!college){
        alert("Invalid college code. Please check and try again.");
        return;
    }
    const students=JSON.parse(localStorage.getItem('students')) || {};
    if(students[collegeCode]){
        const existingStudent = students[collegeCode].find(student=>student.rollNo===rollNo);
        if(existingStudent){
            alert("You are already registered. Redirecting to your student section...");
            window.location.href = 'student_section.html';
            localStorage.setItem('currentStudent', JSON.stringify(existingStudent));
            return;
        }
    } 
    else{
        students[collegeCode]=[];
    }
    const reader=new FileReader();
    reader.onload=function(e){
        students[collegeCode].push({
            studentName,
            rollNo,
            profilePhoto: e.target.result
        });
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('currentStudent', JSON.stringify({
            studentName,
            rollNo,
            collegeCode,
            profilePhoto: e.target.result
        }));
        alert(`Successfully joined ${college.collegeName}!`);
        window.location.href = 'student_section.html'; 
    };
    reader.readAsDataURL(profilePhoto);
}
document.getElementById('join-college-form').addEventListener('submit', joinCollege);
