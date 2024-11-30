function createCollege(){
    const collegeName=document.getElementById('College Name').value;
    const collegeAddress=document.getElementById('College Address').value;
    const collegeEmail=document.getElementById('College Email').value;
    const collegeCode=document.getElementById('College Code').value;
    const logoFile=document.getElementById('College logo').files[0];
    if(!collegeName || !collegeAddress || !collegeEmail || !collegeCode){
        alert("All fields are required!");
        return;
    } 
    if(!logoFile){
        alert("Please upload a college logo.");
        return;
    }
    const colleges=JSON.parse(localStorage.getItem('colleges')) || [];
    const duplicateCode=colleges.some(college=>college.collegeCode===collegeCode);
        if(duplicateCode){
            alert("This college code is already in use. Please choose a different code.");
            window.location.href="college_section.html";
            return;
        }
    const existingCollege=colleges.find(college=>college.collegeName===collegeName && college.collegeAddress===collegeAddress);
    if(existingCollege){
        alert("A college with the same name and address already exists.");
        return;
    }
    const reader=new FileReader();
    reader.onload=function(event){
    colleges.push({
        collegeName,
        collegeAddress,
        collegeEmail,
        collegeCode,
        logo:event.target.result
    });
    localStorage.setItem('colleges',JSON.stringify(colleges));
    alert("College created successfully!");
    window.location.href="college_section.html";
}
reader.readAsDataURL(logoFile);
}