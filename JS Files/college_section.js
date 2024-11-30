document.addEventListener('DOMContentLoaded',function(){
    const colleges=JSON.parse(localStorage.getItem('colleges')) || [];
    const collegeSection=document.getElementById('college-section');
    if(colleges.length===0){
        collegeSection.innerHTML='<p>No colleges available. Please add a college first.</p>';
        return;
    }
    colleges.forEach(college=>{
        const collegeDiv=document.createElement('div');
        collegeDiv.className='college-container';
        collegeDiv.innerHTML=`
            <img src="${college.logo}" alt="College Logo" class="college-logo">
            <h1>${college.collegeName}</h1>
            <h3>${college.collegeAddress}</h3>
            <h3>${college.collegeCode}</h3>
            <button onclick="viewStudentDetails('${college.collegeCode}')">Check Student Details</button>
        `;
        collegeSection.appendChild(collegeDiv);
    });
});
function viewStudentDetails(collegeCode){
    localStorage.setItem('selectedCollegeCode',collegeCode);
    window.location.href='student_details.html';
}
