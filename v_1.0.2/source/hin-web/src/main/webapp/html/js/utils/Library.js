//Function to submit the Username and password from the login form
function submitUser(){
   var pageDetails=document.forms["libraryForm"];
    var username=pageDetails.username.value;
    var password=pageDetails.password.value;
    pageDetails.submit();
}

